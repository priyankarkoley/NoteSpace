const connectToMongo = require("./db");
const express = require("express");

connectToMongo();
const app = express();
const port = 3000;

// // AVAILABLE ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// LISTEN | SPIN UP SERVER
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
