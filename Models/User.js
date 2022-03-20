const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
      data: Buffer,
      contentType: String,
    },
    pi: [{ type: Schema.Types.ObjectId, ref: "Pi" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
