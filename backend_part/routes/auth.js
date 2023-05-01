const express = require ('express');
const User = require('../models/User');
const router = express.Router();

//Create An User using POST /api/auth/createuser | Doesn't require Auth
router.post('/createuser', (req, res) => {
    console.log(req.body);
    const user = User(req.body);
    user.save();
    res.json(req.body);
})


module.exports = router;