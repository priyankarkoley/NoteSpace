import { verify } from "jsonwebtoken";

const fetchUser = (req, res, next) => {
    //takes auth-token from request header
    const token = req.header("token");
    if (!token) res.status(401).send({ error: "Invalid Token" });
    const data = verify(token, "my_secret_password");
    req.user = data.user;
    next();
  }

export default fetchUser