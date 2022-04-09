const express = require("express");
const router = express.Router();
const User = require("../Models/User");

/***
 * @route GET api/user/pi
 * @desc Authenticate User and Return Users List of Pi's
 * @access Private
 *
 */

router.get("/", async (req, res, next) => {
  // console.log(req.user.id);
  try {
    const PiList = await User.findOne({ _id: req.user.id })
      .populate("pi", "-__v -user")
      .then((res) => {
        return res.pi;
      });
    // console.log(PiList);
    req.encryptUserData = PiList;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
