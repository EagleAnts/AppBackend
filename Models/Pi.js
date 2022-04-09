const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PiSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    rpiusername: { type: String, required: true, trim: true },
    rpipassword: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, trim: true },
    netDetails: { type: String, required: true },
    user: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
// PiSchema.index({username: 1, email: 1}, {unique: true});
module.exports = mongoose.model("Pi", PiSchema);
