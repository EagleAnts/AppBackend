const express = require("express");

const router = express.Router();
const Device = require("../../Models/Device");
const DeviceType = require("../../Models/DeviceType");

const changeStream = Device.watch().on("change", (change) =>
  console.log(change.operationType)
);

router.get("/", (req, res, next) => {
  Device.find({ user: req.headers.userid })
    .select("-_id -__v -user")
    .populate("description")
    .exec(function (err, device) {
      if (err) return handleError(err);
      if (device) {
        req.encryptUserData = {
          device,
          userData: `${req.session.user.firstName} ${req.session.user.lastName}`,
        };
      }
      next();
    });
});

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
// for device Type

// router.post("/addDevice", async (req, res) => {
//   console.log(req);

//   const device = new DeviceType(req.body);

//   await device.save();
// });

module.exports = router;
