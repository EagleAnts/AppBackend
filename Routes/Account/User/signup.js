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
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();
  const email = req.body.email.trim();
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
      name: `${firstName} ${lastName}`,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    // const payload = {
    //   user: {
    //     id: user.id,
    //   },
    // };

    // jwt.sign(
    //   payload,
    //   config.get("JWT.TOKEN_SECRET"),
    //   {
    //     expiresIn: "5 days",
    //   },
    //   (err, token) => {
    //     if (err) throw err;
    //     res.json({ token, msg: "Account Created. Please Login", aesKey });
    //   }
    // );
    res.json({ msg: "Account Created. Please Login" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
