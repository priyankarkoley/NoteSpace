import mongoose from "mongoose";
const mongoURI = "mongodb://127.0.0.1:27017/NoteSpace?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.2";

export const connectToMongo = async () => {
  await mongoose.connect(mongoURI);
  console.log("Connected To Database");
};
