const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// piID: string;
// networkID: string;
// piUsername: string;
// piName: string;
// netDetails: string;
// deviceList: Array<DeviceListType>
const PiSchema = new Schema(
  {
    piName: { type: String, required: true, trim: true },
    piUsername: { type: String, required: true, trim: true },
    piPassword: { type: String, required: true },
    password: { type: String, required: true },
    userEmail: { type: String, required: true, trim: true },
    netDetails: { type: String, required: true },
    networkID: {
      type: Schema.Types.ObjectId,
      ref: "BlockchainNetwork",
    },
    user: [{ type: Schema.Types.ObjectId, ref: "User" }],
    apiKey: { type: String, required: true },
    deviceList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Device",
      },
    ],
  },
  { timestamps: true }
);
// PiSchema.index({username: 1, email: 1}, {unique: true});
module.exports = mongoose.model("Pi", PiSchema);
