const express = require("express");

const router = express.Router();
const Device = require("../../Models/Device");
const DeviceType = require("../../Models/DeviceType");

const changeStream = Device.watch().on("change", (change) =>
  console.log(change.operationType)
);

router.post("/add", async (req, res, next) => {
  console.log(req.body);

  const userID = req.body.userID;
  const deviceType = req.body.option;

  const retrievedDevice = await DeviceType.findOne({ type: deviceType });

  const device = new Device({
    user: userID,
    ...req.body,
    description: retrievedDevice._id,
    status: false,
  });
  await device.save();

  console.log(retrievedDevice);
  req.encryptUserData = retrievedDevice;
  next();
  // res.json(retrievedDevice);
});
