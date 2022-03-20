const jwt = require("jsonwebtoken");
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

module.exports = function (req, res, next) {
  const paths = [
    "/account/user/login",
    "/account/user/signup",
    "/account/pi/login",
    "/account/pi/signup",
    "/account/admin/login",
    "/devicetype",
  ];
  if (!req.headers["x-auth-token"]) {
    console.log(req);
    if (paths.includes(req.originalUrl)) {
      if (
        req.body &&
        req.method === "POST" &&
        req.originalUrl != "/account/admin/login" &&
        req.originalUrl != "/devicetype"
      )
        req.body = rsaDataDecryption(req.body.key_data);
      next();
    } else {
      return res.status(401).json({ msg: "No token, Authorization Denied" });
    }
  } else {
    try {
      const token = rsaDataDecryption(req.headers["x-auth-token"]);
      jwt.verify(token, config.get("JWT.TOKEN_SECRET"), (err, data) => {
        if (err) {
          //   console.error(err);
          return res.status(401).json({ msg: "Token is not valid" });
        }
        req.user = data;
        next();
      });
    } catch (err) {
      console.error("Something wrong with Authentication middleware");
      res.status(500).json({ msg: "Sever Error" });
    }
  }
};
