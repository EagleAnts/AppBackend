const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeviceTypeSchema = new Schema({
  type: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
  },

  icon: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("deviceType", DeviceTypeSchema);
