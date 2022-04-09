const cors = require("cors");
const express = require("express");
const { connectSocket } = require("./socketHandler");
const app = express();
const { createServer } = require("http");
const httpServer = createServer(app);

// const ADT = require("./Helpers/addDeviceType");
// const flush = require("./Function/flushDB");

// CA({
//   name: "Paritosh Chauhan",
//   email: "pariboy@pari.com",
// });
// flush();
// Initializes and using cors to control the requests behavior
app.use(
  cors({
    origin: ["http://localhost:19006", "http://localhost:3000", "*"],
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

// Method used for connecting to the database
const connectMongoDB = require("./config/db");
connectMongoDB();

/***
 * @route GET /
 * @desc Default Route For Displaying that Server is Up and Running
 * @access Public
 */
app.get("/", (req, res) => {
  res.send("Server is Up and Running....");
});

// app.get("/api/admin", (req, res) => {
//   res.sendFile(path.join(__dirname, "./HTML/login.html"));
// });
// app.post("/api/devicetype", (req, res) => {
//   ADT(req.body);
//   res.sendFile(path.join(__dirname, "./HTML/deviceType.html"));
// });

// For something to act like a middleware, it should be a function
// // This function will be called for each Route

/**
 *
 * Authentication Middleware
 *
 */
app.use("/api", require("./Middleware/Authenticate"));

/***
 *
 * API Routes
 *
 */

app.use("/api/user/login", require("./Routes/Account/User/login"));
app.use("/api/user/signup", require("./Routes/Account/User/signup"));

app.use("/api/user/pi", require("./Routes/PiInfo"));

// app.use("/api/account/admin/login", require("./Routes/Account/Admin/login"));

// app.use("/api/account/pi/login", require("./Routes/Account/Pi/login"));
// app.use("/api/account/pi/signup", require("./Routes/Account/Pi/signup"));

// This function will be called for each Route

// app.use("/api", require("./Routes/Middleware/decrypt"));
// app.use("/api/user/update", require("./Routes/Account/User/update"));
// app.use("/api/user/delete", require("./Routes/Account/User/delete"));
// app.use("/api/pi/update", require("./Routes/Account/Pi/update"));
// app.use("/api/pi/delete", require("./Routes/Account/Pi/delete"));

// app.use("/device/add", require("./Device/add"));
// app.use("/device/remove", require("./Device/remove"));
// app.use("/device/update", require("./Device/update"));
// app.use("/device/get", require("./Device/get"));

// This function will encrypt everything going out
app.use("/api", require("./Middleware/encrypt"));

// Tells the Server to listen for requests on Specified Port
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server Started on PORT ${PORT}`));
connectSocket(httpServer);
