const express = require("express");

const router = express.Router();
const Device = require("../../Models/Device");
const DeviceType = require("../../Models/DeviceType");

const changeStream = Device.watch().on("change", (change) =>
  console.log(change.operationType)
);

router.post("/update", async (req, res) => {
  const filter = { deviceID: req.body.deviceID };
  const update = { status: req.body.status };

  const userDevices = await Device.find({ user: req.body.userID });
  const device = userDevices.find((el) => el.deviceID === req.body.deviceID);

  if (!device) {
    return res.send("Device Doesn't Exist");
  }
  if (device.user.toString() !== req.body.userID) {
    return res.send("User not authorized");
  }

  await Device.findOneAndUpdate(filter, update).exec(function (err, device) {
    if (err) console.log(err);
    else res.send("Status Changed...");
  });
});
