const express = require ('express');
const User = require('../models/User');
const {body, validationResult} = require('express-validator');
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

//Create An User using POST /api/auth/createuser | NO LOGIN
router.post('/createuser',
    [
        body('name', 'Enter A valid name(atleast 2 characters)').isLength({min : 2}),
        body('email',  'Enter A valid email').isEmail(),
        body('password', 'Enter A valid password(atleast 5 characters)').isLength({min : 5})
    ],
    async (req, res) => {
        // show 400 error if any
        const err = validationResult(req);
        if(!err.isEmpty()){
            return res.status(400).json({errors : err.array()[0].msg});
        }
        try {
            //check if email exists
            let user = await User.findOne({email : req.body.email});
            if(user){
                return res.status(400).json({error : "Email already in use"});
            }
            // CREATING NEW USER IN DB
            const salt = await bcrypt.genSalt(10);
            let secpass = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password : secpass
            });
            // CREATING Auth Tocken for user
            data = {
                user:{id: user.id}
            }
            var authTocken = jwt.sign(data, 'my_secret_password');
                res.json({authTocken});
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
    }
)
        
        
module.exports = router;