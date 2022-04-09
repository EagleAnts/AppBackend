const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  sessionID: { type: String, unique: true, required: true, trim: true },
  userID: { type: String, unique: true, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  connected: { type: Boolean, unique: true, required: true },
});

module.exports = mongoose.model("Session", SessionSchema);
