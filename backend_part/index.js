import {connectToMongo} from "./db.js";
import express from "express";
import auth_router from './routes/auth.js'
import notes_router from './routes/notes.js'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

console.log(process.env.REACT_VAR);

connectToMongo();
const app = express();
const port = 5000;

app.use(express.json());

// // AVAILABLE ROUTES
app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/api/auth",  auth_router);
app.use("/api/notes",notes_router);

// LISTEN | SPIN UP SERVER
app.listen(port, () => {
  console.log(
    `Example app listening on port http://localhost:${port}/ or http://192.168.9.106:${port}`
  );
});
