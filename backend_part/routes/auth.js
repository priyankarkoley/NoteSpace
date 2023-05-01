const express = require ('express');
const User = require('../models/User');
const {body, validationResult} = require('express-validator');
const router = express.Router();

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
            else{
                // CREATING NEW USER IN DB
                user = User(req.body);
                user.save();
                res.json(user);
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
    }
)
        
        
        module.exports = router;