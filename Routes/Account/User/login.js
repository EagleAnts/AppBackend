const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../../Models/User");

/***
 * @route GET api/user/login
 * @desc Authenticate User and Get Token
 * @access Private
 *
 */

router.get("/", async (req, res, next) => {
  // console.log("User Details", req.user);
  try {
    const user = await User.findById(req.user.id).select("-_id name email");
    req.encryptUserData = { ...user._doc, id: req.user.id };

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/***
 * @route POST api/user/login
 * @desc Authenticate User and Get Token
 * @access Public
 *
 */

router.post("/", async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body.data;
  req.user = { aesKey: req.body.aesKey };
  try {
    // Empty email and password check
    if (!email || !password) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Please Enter the Correct Credentials" }] });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Please Enter the Correct Credentials" }] });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      id: user.id,
      aesKey: req.body.aesKey,
    };

    jwt.sign(
      payload,
      config.get("JWT.TOKEN_SECRET"),
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        req.encryptUserData = { token: token };
        next();

        // res.json({ token, aesKey });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
