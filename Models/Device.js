const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
  },
  deviceID: {
    type: String,
  },

  name: {
    type: String,
    trim: true,
  },

  description: {
    type: Schema.Types.ObjectId,
    ref: "deviceType",
  },

  area: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

module.exports = new mongoose.model("device", DeviceSchema);
