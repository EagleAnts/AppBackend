const Admin = require("../Models/Admin");
const User = require("../Models/User");
const Pi = require("../Models/Pi");
const DeviceType = require("../Models/DeviceType");

module.exports = async function () {
  console.log(
    (await User.collection.drop()) +
      " " +
      (await DeviceType.collection.drop()) +
      " " +
      (await Admin.collection.drop()) +
      " " +
      (await Pi.collection.drop())
  );
};
