const CryptoJS = require("crypto-js");

function encryptUserData(req, res) {
  if (!req.encryptUserData) return res.json({ error: "No Data Returned" });
  let encryptUserData = req.encryptUserData;
  var ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify({ encryptUserData }),
    req.user.aesKey
  ).toString();
  res.json({ data: ciphertext });
}

module.exports = encryptUserData;
