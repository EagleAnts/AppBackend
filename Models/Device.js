const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
  pi: {
    type: Schema.Types.ObjectId,
    ref: "Pi",
  },
  name: {
    type: String,
    trim: true,
  },
  deviceType: {
    type: Schema.Types.ObjectId,
    ref: "deviceType",
  },
  area: {
    type: String,
    required: true,
    trim: true,
  },
  gpio: {
    type: Number,
    required: true,
    unique: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Device", DeviceSchema);
