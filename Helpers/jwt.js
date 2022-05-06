const jwt = require("jsonwebtoken");
const config = require("config");
function generateJwt(payload, expires = false) {
  try {
    const token = jwt.sign(payload, config.get("JWT.TOKEN_SECRET"), {
      expiresIn: expires ? expires : "5 days",
    });
    return { token };
  } catch (err) {
    console.log("Error while generating token..", err);
    throw new Error({ status: 400, msg: "Bad Request" });
  }
}
function jwtTokenVerify(token) {
  return jwt.verify(token, config.get("JWT.TOKEN_SECRET"), (err, data) => {
    console.log(data);
    if (err) {
      console.error(err);
      return { status: 401, msg: "Token is not valid", valid: false };
    }
    return { status: 200, msg: "Success", valid: true, data };
  });
}

module.exports = {
  generateJwt,
  jwtTokenVerify,
};
