const express = require("express");

const router = express.Router();
const Device = require("../../Models/Device");
const DeviceType = require("../../Models/DeviceType");

const changeStream = Device.watch().on("change", (change) =>
  console.log(change.operationType)
);

router.post("/remove", async (req, res) => {
  const userID = req.body.userID;
  const deviceID = req.body.deviceID;

  const userDevices = await Device.find({ user: userID });

  const device = userDevices.find((el) => el.deviceID === deviceID);
  if (!device) {
    return res.send("Device Doesn't Exist");
  }
  if (device.user.toString() !== userID) {
    return res.send("User not authorized");
  }

  await Device.findOneAndDelete({ deviceID: deviceID }).exec(function (
    err,
    device
  ) {
    if (err) console.log(err);
    else res.send("Device Removed...");
  });
});
