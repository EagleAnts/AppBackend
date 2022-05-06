const User = require("../Models/User");
const Pi = require("../Models/Pi");
const bcrypt = require("bcrypt");
const { generateJwt } = require("./jwt");
const { v4: uuidv4 } = require("uuid");
const { validateUser, validateNoQuotes } = require("./validate");
const crypto = require("crypto");
const networkNode = require("./networkNode");

module.exports.registerRaspberryPi = async function registerRaspberryPi(data) {
  try {
    let { email, password, rpiusername, rpipassword, rpiname, netDetails } =
      data;

    console.log(netDetails);
    const validationRes = await validateUser({
      email,
      password,
    });

    console.log("Validation Response :", validationRes);

    if (!validationRes.valid) return validationRes;
    email = validationRes.email;
    rpiusername = rpiusername.trim();
    rpiname = rpiname.trim();

    if (!(validateNoQuotes(rpiusername) && validateNoQuotes(rpiname)))
      return {
        status: 400,
        valid: false,
        errors: [{ msg: "Please Type a valid input" }],
      };

    /**
     *
     * Storing Pi Details
     *
     **/

    let pi = await Pi.findOne({ email, piName: rpiname });

    if (pi) {
      return {
        status: 202,
        errors: [{ msg: "A RaspberryPi with this name already exists" }],
      };
    }
    let passid = uuidv4();

    pi = new Pi({
      userEmail: email,
      piUsername: rpiusername,
      piPassword: rpipassword,
      piName: rpiname,
      password: passid,
      user: [validationRes.user._id],
      netDetails,
    });

    const salt = await bcrypt.genSalt(10);
    pi.piPassword = await bcrypt.hash(rpipassword, salt);

    const piDetails = await pi.save();
    const rpiID = piDetails._id;

    await User.findByIdAndUpdate(
      validationRes.user._id,
      { $push: { pi: rpiID } },
      {
        new: true,
        upsert: true,
      }
    );

    /****
     *
     * Adding raspi to blockchain network
     *
     ****/

    const blockchainDetails = await networkNode(rpiID);

    /***
     *
     * Returning response
     *
     ***/

    const payload = {
      email,
      rpiusername,
      rpiname,
    };

    return {
      piID: rpiID,
      networkID: blockchainDetails.networkID,
      passid,
      token: generateJwt(payload).token,
      status: 200,
      msg: "Successfully Registered Your Raspberry Pi",
    };
  } catch (err) {
    console.error(err.message);
    return { status: 500, msg: "Server Error" };
  }
};
