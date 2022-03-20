const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../../Models/Admin");
const path = require("path");

/***
 * @route POST api/login
 * @desc Authenticate User and Get Token
 * @access Public
 *
 */

router.post("/", async (req, res) => {
  let { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user || !email || !password) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Please Enter the Correct Credentials" }] });
    }
    email = email.trim();
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    // const payload = {
    //   id: user.id,
    // };

    // jwt.sign(
    //   payload,
    //   config.get("JWT.TOKEN_SECRET"),
    //   { expiresIn: 3600 },
    //   (err, token) => {
    //     if (err) throw err;
    //     res.json({ token });
    //   }
    // );
    res.sendFile(path.join(__dirname, "../../../HTML/deviceType.html"));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
