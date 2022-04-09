const { jwtTokenVerify } = require("../Helpers/jwt");
const config = require("config");
const crypto = require("crypto");

function rsaDataDecryption(data) {
  const privateKey = config.get("PRIVATE_KEY").replace(/\\n/g, "\n");
  const rsaPrivateKey = {
    key: privateKey,
    passphrase: "",
    padding: crypto.constants.RSA_PKCS1_PADDING,
  };

  const decryptedMessage = crypto.privateDecrypt(
    rsaPrivateKey,
    Buffer.from(data, "base64")
  );

  return JSON.parse(decryptedMessage.toString("utf8"));
}

function userAuthentication(io) {
  io.use((socket, next) => {
    const token = rsaDataDecryption(socket.handshake.auth.token);
    if (!token) return false;
    const jwtRes = jwtTokenVerify(token);
    if (!jwtRes.valid) return false;
    next();
  });
}

module.exports = function (req, res, next) {
  const paths = ["/api/user/login", "/api/user/signup"];

  if (!req.headers["x-auth-token"]) {
    if (paths.includes(req.originalUrl)) {
      if (req.body && req.method === "POST")
        req.body = rsaDataDecryption(req.body.data);
      next();
    } else {
      return res.status(401).json({ msg: "No token, Authorization Denied" });
    }
  } else {
    const token = rsaDataDecryption(req.headers["x-auth-token"]);
    const jwtRes = jwtTokenVerify(token);
    if (jwtRes.valid) {
      req.user = jwtRes.data;
      next();
    } else return res.status(401).json({ msg: jwtRes.msg });
  }
};

exports.rsaDataDecryption = rsaDataDecryption;
module.exports.userAuthentication = userAuthentication;
