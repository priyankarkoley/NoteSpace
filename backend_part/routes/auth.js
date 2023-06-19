import { Router } from "express";
import UserModel from "../models/User.js";
import { body, validationResult } from "express-validator";
import { genSalt, hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import fetchUser from "./middlewares/fetchUser.js";

const auth_router = Router();
//---------------------------------------------------------------------------
//Create An User, using POST /api/auth/createuser | NO LOGIN
auth_router.post(
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
      let user = await UserModel.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Email already in use" });
      }
      // CREATING NEW USER IN DB
      const salt = await genSalt(10);
      let secpass = await hash(req.body.password, salt);
      user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass,
      });
      //Generate Authorization Token
      data = {
        user: { id: user.id },
      };
      var authTocken = sign(data, "my_secret_password");
      res.json({ authTocken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//---------------------------------------------------------------------------
//Login For Users, using POST /api/auth/login | NO LOGIN
auth_router.post(
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
      const user = await UserModel.findOne({ email });
      //Check if User exists
      if (!user) {
        return res.status(400).json({ errors: "Invalid Creds[email]" });
      }
      //Check if Password entered is right
      const isRightPw = await compare(password, user.password);
      if (!isRightPw) {
        return res.status(400).json({ errors: "Invalid Creds[password]" });
      }
      //Generate Authorization Token
      const data = {
        user: { id: user.id },
      };
      var authTocken = sign(data, "my_secret_password");
      res.json({ authTocken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//---------------------------------------------------------------------------
//Users Data when Logged In, using POST /api/auth/login | NO LOGIN
auth_router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const userid = req.user.id;
    const user = await UserModel.findById(userid).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

export default auth_router;
