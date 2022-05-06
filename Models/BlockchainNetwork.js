const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlockchainNetworkSchema = new Schema(
  {
    count: { type: Number, required: true },
    pi: [{ type: Schema.Types.ObjectId, ref: "Pi" ,required: true}],
  },
  { timestamps: true }
);
module.exports = mongoose.model("BlockchainNetwork", BlockchainNetworkSchema);
