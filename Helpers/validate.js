const User = require("../Models/User");
const bcrypt = require("bcrypt");

const validateNoQuotes = function (val) {
  return !/['"]+/.test(val);
};

const validateEmail = function (email) {
  pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (pattern.test(email) && validateNoQuotes(email))
    return pattern.exec(email)[0];
  else return false;
};

const validateUser = async function (data) {
  try {
    const email = validateEmail(data.email);
    const password = validateNoQuotes(data.password) ? data.password : false;
    if (!email || !password) {
      return {
        valid: false,
        status: 401,
        errors: [{ msg: "Please Enter the Correct Credentials" }],
      };
    }
    let user = await User.findOne({ email });
    if (!user) {
      return {
        valid: false,
        status: 401,
        errors: [{ msg: "Please Enter the Correct Credentials" }],
      };
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return {
        valid: false,
        status: 401,
        errors: [{ msg: "Invalid Credentials" }],
      };
    }
    return { valid: true, email, user };
  } catch (err) {
    console.error(err.message);
    return { valid: false, msg: "Server Error" };
  }
};

module.exports = { validateEmail, validateNoQuotes, validateUser };
