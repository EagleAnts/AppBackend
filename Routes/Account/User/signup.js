const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");
const User = require("../../../Models/User");

/****
 *
 * @route POST api/signup
 * @desc Register user
 * @access Public
 */

router.post("/", async (req, res) => {
  const firstName = firstName ? req.body.firstName.trim() : firstName;
  const lastName = lastName ? req.body.lastName.trim() : lastName;
  const email = email ? req.body.email.trim() : email;
  const password = req.body.password;
  try {
    if (!(req.body.confirmPassword === password && firstName && email))
      return res
        .status(400)
        .json({ errors: [{ msg: "Please Enter the Correct Credentials" }] });
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User Already Exists" }] });
    }

    user = new User({
      name: `${firstName} ${user.lastName}`,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    const aesKey = genString(32);
    const payload = {
      user: {
        id: user.id,
        aesKey,
      },
    };

    jwt.sign(
      payload,
      config.get("JWT.TOKEN_SECRET"),
      {
        expiresIn: "5 days",
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token, msg: "Account Created. Please Login", aesKey });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
