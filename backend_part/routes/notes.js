const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const fetchUser = require("./middlewares/fetchUser");
const { body, validationResult } = require("express-validator");

//---------------------------------------------------------------------------
//Endpoint to FETCH all notes, using GET | LOGIN REQUIRED
router.get("/get", fetchUser, async (req, res) => {
  const notes = await Note.find({ usertoken: req.user.id });
  res.json(notes);
});

//---------------------------------------------------------------------------
//Endpoint to ADD notes, using POST | LOGIN REQUIRED
router.post("/add", fetchUser, async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }
    try {
      const { title, description, tag } = req.body;
      let note = new Note({ title, description, tag, usertoken: req.user.id });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//---------------------------------------------------------------------------
//Endpoint to UPDATE all notes, using GET | LOGIN REQUIRED
router.put("/update/:id", fetchUser, async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }
    try {
      const noteid = req.params.id;
      const { title, description, tag } = req.body;
      //Check if note exists
      let checknote = await Note.findById(noteid);
      if (!checknote) return res.status(404).send("Not Found");
      // check if note belogs to logged in user
      if (checknote.usertoken.toString() !== req.user.id) 
        return res.status(401).send("Invalid User");
      let newnote = {};
      if (title) newnote.title = title;
      if (description) newnote.description = description;
      if (tag) newnote.tag = tag;
      let updatednote = await Note.findByIdAndUpdate(noteid, {$set:newnote}, {new:true})
      res.json(updatednote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
