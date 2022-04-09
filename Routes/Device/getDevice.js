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
