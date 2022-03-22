const cors = require("cors");
const config = require("config");
const express = require("express");
const connectMongoDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
const ADT = require("./Helpers/addDeviceType");
// const flush = require("./Function/flushDB");

// Method used for connecting to the database
connectMongoDB();
// CA({
//   name: "Paritosh Chauhan",
//   email: "pariboy@pari.com",
// });
// flush();
// Initializes and using cors to control the requests behavior
app.use(
  cors({
    origin: ["http://localhost:19006", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
// Allows parsing of data in json format
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

/***
 * @route GET /
 * @desc Default Route For Displaying that Server is Up and Running
 * @access Public
 */
app.get("/", (req, res) => {
  res.send("Server is Up and Running....");
});
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "./HTML/login.html"));
});
app.post("/devicetype", (req, res) => {
  ADT(req.body);
  res.sendFile(path.join(__dirname, "./HTML/deviceType.html"));
});
// For something to act like a middleware, it should be a function
// // This function will be called for each Route

app.use("/", require("./Middleware/Authenticate"));
// app.use("/account/user/login", require("./Routes/Account/User/login"));
// app.use("/account/user/signup", require("./Routes/Account/User/signup"));
app.use("/account/admin/login", require("./Routes/Account/Admin/login"));
// app.use("/account/pi/login", require("./Routes/Account/Pi/login"));
// app.use("/account/pi/signup", require("./Routes/Account/Pi/signup"));
// This function will be called for each Route
// app.use("/", require("./Routes/Middleware/decrypt"));
// app.use("/account/user/update", require("./Routes/Account/User/update"));
// app.use("/account/user/delete", require("./Routes/Account/User/delete"));
// app.use("/account/pi/update", require("./Routes/Account/Pi/update"));
// app.use("/account/pi/delete", require("./Routes/Account/Pi/delete"));
// app.use("/device/add", require("./Device/add"));
// app.use("/device/remove", require("./Device/remove"));
// app.use("/device/update", require("./Device/update"));
// app.use("/device/get", require("./Device/get"));

// This function will encrypt everything going out
// app.use("/", require("./Routes/Middleware/encrypt"));

// Tells the Server to listen for requests on Specified Port
app.listen(PORT, () => console.log(`Server Started on PORT ${PORT}`));
