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

//---------------------------------------------------------------------------
//Endpoint to ADD notes, using POST | LOGIN REQUIRED
router.post('/add',[
    body("title", "Title must have atleast 2 characters").isLength({min: 2,}),
    body("description", "Description must have atleast 5 characters").isLength({min: 5,}),
  ], fetchUser, async(req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({errors: err.array()});
    }
    try {
        const {title, description, tag} = req.body
        let note = new Note({title, description, tag, usertoken : req.user.id});
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
})

module.exports = router;