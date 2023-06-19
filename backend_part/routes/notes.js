import { Router } from "express";
const notes_router = Router();
import Note, {
  find,
  findById,
  findByIdAndUpdate,
  findByIdAndDelete,
} from "../models/Note.js";
import fetchUser from "./middlewares/fetchUser.js";

//---------------------------------------------------------------------------
//Endpoint to FETCH all notes, using GET | LOGIN REQUIRED
notes_router.get("/get", fetchUser, async (req, res) => {
  const notes = await find({ usertoken: req.user.id });
  res.json(notes);
});

//---------------------------------------------------------------------------
//Endpoint to ADD notes, using POST | LOGIN REQUIRED
notes_router.post("/add", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    let note = new Note({ title, description, tag, usertoken: req.user.id });
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//---------------------------------------------------------------------------
//Endpoint to UPDATE all notes, using GET | LOGIN REQUIRED
notes_router.put("/update/:id", fetchUser, async (req, res) => {
  try {
    const noteid = req.params.id;
    const { title, description, tag } = req.body;
    //Check if note exists
    let checknote = await findById(noteid);
    if (!checknote) return res.status(404).send("Not Found");
    // check if note belogs to logged in user
    if (checknote.usertoken.toString() !== req.user.id)
      return res.status(401).send("Invalid User");
    let newnote = {};
    if (title) newnote.title = title;
    if (description) newnote.description = description;
    if (tag) newnote.tag = tag;
    let updatednote = await findByIdAndUpdate(
      noteid,
      { $set: newnote },
      { new: true }
    );
    res.json(updatednote);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//---------------------------------------------------------------------------
//Endpoint to UPDATE all notes, using GET | LOGIN REQUIRED
notes_router.delete("/delete/:id", fetchUser, async (req, res) => {
  try {
    const noteid = req.params.id;
    //Check if note exists
    let note = await findById(noteid);
    if (!note) return res.status(404).send("Not Found");
    // check if note belogs to logged in user
    if (note.usertoken.toString() !== req.user.id)
      return res.status(401).send("Invalid User");
    let updatednote = await findByIdAndDelete(noteid);
    res.json({ "Successs!": "Note deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

export default notes_router;
