const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.send("OK");
});

module.exports = router;
