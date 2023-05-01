const mongoose = require("mongoose");
const mongoURI = "mongodb://127.0.0.1:27017/NoteSpace";

const connectToMongo = async () => {
  mongoose.connect(mongoURI);
  await console.log("Connected To Database");
};
module.exports = connectToMongo;