const DeviceType = require("../Models/DeviceType");
const bcrypt = require("bcrypt");

module.exports = async function (data) {
  try {
    await DeviceType.create(data);
  } catch (err) {
    console.log(err);
  }
};
