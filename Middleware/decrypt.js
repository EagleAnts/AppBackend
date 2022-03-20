const CryptoJS = require("crypto-js");

module.exports = function (req, res, next) {
  if (req.body.data) {
    const bytes = CryptoJS.AES.decrypt(req.body.data, req.user.aesKey);
    req.body.data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  next();
};
