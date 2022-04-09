const CryptoJS = require("crypto-js");

function encryptUserData(req, res) {
  console.log("Encrypting Data.. : ", req.encryptUserData);
  if (!req.encryptUserData)
    return res
      .status(400)
      .json({ errors: [{ msg: "No Data Returned", type: "info" }] });
  const encryptUserData = req.encryptUserData;
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(encryptUserData),
    req.user.aesKey
  ).toString();

  res.json(ciphertext);
}

module.exports = encryptUserData;
