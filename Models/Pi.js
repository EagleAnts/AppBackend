const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PiSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    netDetails: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pi", PiSchema);
