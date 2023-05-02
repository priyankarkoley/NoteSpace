const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

//Create An User, using POST /api/auth/createuser | NO LOGIN
router.post(
  "/createuser",
  [
    body("name", "Enter A valid name(atleast 2 characters)").isLength({
      min: 2,
    }),
    body("email", "Enter A valid email").isEmail(),
    body("password", "Enter A valid password(atleast 5 characters)").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // show 400 error if any
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array(), 1: 1 });
    }
    try {
      //check if email exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Email already in use" });
      }
      // CREATING NEW USER IN DB
      const salt = await bcrypt.genSalt(10);
      let secpass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass,
      });
      //Generate Authorization Token
      data = {
        user: { id: user.id },
      };
      var authTocken = jwt.sign(data, "my_secret_password");
      res.json({ authTocken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//Login For Users, using POST /api/auth/login | NO LOGIN
router.post(
  "/login",
  [
    body("email", "Enter A valid email").isEmail(),
    body("password", "Passwword can't be blank").exists(),
  ],
  async (req, res) => {
    // show 400 error if any
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: "Invalid Credenetials" });
    }
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      //Check if User exists
      if (!user) {
        return res.status(400).json({ errors: "Invalid Creds[email]" });
      }
      //Check if Password entered is right
      const isRightPw = await bcrypt.compare(password, user.password);
      if (!isRightPw) {
        return res.status(400).json({ errors: "Invalid Creds[password]" });
      }
      //Generate Authorization Token
      const data = {
        user: { id: user.id },
      };
      var authTocken = jwt.sign(data, "my_secret_password");
      res.json({ authTocken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//Users Data when Logged In, using POST /api/auth/login | NO LOGIN
router.post(
  "/getuser",
  (req, res, next) => {
    const token = req.header("token");
    if (!token) res.status(401).send({ error: "Invalid Token" });
    const data = jwt.verify(token, "my_secret_password");
    req.user = data.user;
    next();
  },
  async (req, res) => {
    try {
      const userid = req.user.id;
      const user = await User.findById(userid).select("-password");
      res.status(200).json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
