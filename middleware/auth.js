const jwt = require("jsonwebtoken");
const config = require("config");

function validateToken(req, res, next) {
  const token = req.headers["x-auth-token"];
  // console.log(token);

  if (!token)
    return res.status(401).json({ msg: "No token, Authorization Denied" });

  // Verify Token
  try {
    jwt.verify(token, config.get("JWT.TOKEN_SECRET"), (err, data) => {
      if (err) {
        //   console.error(err);
        return res.status(401).json({ msg: "Token is not valid" });
      }
      req.user = data.user;
      next();
    });
  } catch (err) {
    console.error("Something wrong with auth middleware");
    res.status(500).json({ msg: "Sever Error" });
  }
}

module.exports = validateToken;
