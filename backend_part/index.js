const connectToMongo = require("./db");
const express = require("express");

connectToMongo();
const app = express();
const port = 5000;

app.use(express.json());

// // AVAILABLE ROUTES
app.get('/', (req,res)=>{res.send('hello')})
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// LISTEN | SPIN UP SERVER
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/ or http://192.168.29.64:${port}`);
});
