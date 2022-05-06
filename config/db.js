/*
  This Module is used for configuring and connecting to the Database used by the Server.
  The Methods available in this module are :
  connectDB = { type : Async }
*/
const mongoose = require("mongoose");
// For Parsing Configuration Information Like, Port No, DB Info ,Etc.
const config = require("config");
// config.get() will throw an exception for undefined keys to help catch typos and missing values.
// It's Used to get value of Mongo URI
const dbUri = config.get("MONGO_DB.MONGO_URI");

// This method is used for establishing a connection with the database
const connectDB = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect(dbUri);
      console.log("MongoDB Connected...");
      resolve(200);
    } catch (err) {
      console.error(err.message);
      // Exit process with failure
      reject(100);
      process.exit(1);
    }
  });
};

// This method is used for Setting the Configuration Parameters of the Database
const configDB = async () => {
  console.log("Using default Configuration");
};

module.exports = connectDB;
