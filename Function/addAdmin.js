const Admin = require("../Models/Admin");
const bcrypt = require("bcrypt");

module.exports = async function (data) {
  const password = await bcrypt.hash("admin123#", 10);
  data.password = password;
  await Admin.create(data);
};
