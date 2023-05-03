var jwt = require("jsonwebtoken");

const fetchUser = (req, res, next) => {
    //takes auth-token from request header
    const token = req.header("token");
    if (!token) res.status(401).send({ error: "Invalid Token" });
    const data = jwt.verify(token, "my_secret_password");
    req.user = data.user;
    next();
  }

module.exports = fetchUser