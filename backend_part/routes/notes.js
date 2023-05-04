const express = require ('express')
const router = express.Router();
const Note = require('../models/Note');
const fetchUser = require('./middlewares/fetchUser');
const { body, validationResult } = require("express-validator");

//---------------------------------------------------------------------------
//Endpoint to FETCH all notes, using GET | LOGIN REQUIRED
router.get('/get', fetchUser, async(req, res) => {
    const notes = await Note.find({usertoken : req.user.id});
    res.json(notes);
})



module.exports = router;