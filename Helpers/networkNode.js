const BlockchainNetwork = require("../Models/BlockchainNetwork");
const Pi = require("../Models/Pi");

async function registerBlockchain(piId) {
  let network = await BlockchainNetwork.findOne({ count: { $lt: 5 } });

  if (network) {
    // chain
    // Selecting piId0 from network or chain
    // piId0 bc{
    //   "My":--,
    //   "piId1":--,
    //   "piId2":--
    // }
    // bc["piID0"] = bc.My
    // del bc["My"]
    // emit newnode bc["my"] = []
    //method 2
    // network 4
    // emit for each new node bc["newnodeid"] = []
    // res network pi
    // bc{ my : empty, pi : em}

    await BlockchainNetwork.findByIdAndUpdate(
      network._id,
      { $push: { pi: piId }, $inc: { count: 1 } },
      {
        new: true,
        upsert: true,
      }
    );
  } else {
    network = await BlockchainNetwork.create({
      count: 1,
      pi: [piId],
    });
    console.log(network);
  }

  // Adding Blockchain details to Pi
  if (network) {
    await Pi.findByIdAndUpdate(
      piId,
      { $set: { networkID: network._id } },
      {
        new: true,
        upsert: true,
      }
    );
  }

  return { networkID: network._id };
}

module.exports = registerBlockchain;
