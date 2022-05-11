const updateDatabase = {};
const Device = require("../Models/Device");

updateDatabase.toggleDevice = function (data) {
  Device.findByIdAndUpdate(data.content.deviceID, {
    $set: { status: data.content.status },
  })
    .then((res) => {
      console.log("Updated Successfully.. ✅");
    })
    .catch((err) => console.log(err));
};

module.exports = updateDatabase;
