require("./socketHandler");
const cors = require("cors");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
// const session = require("express-session");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  console.log("Hello User", socket.id);
});
io.on("disconnect", (socket) => {
  console.log("Bye User", socket.id);
});

// const { v4: genuuid } = require("uuid");

//Connect Database
connectDB();

// Using Middlewares

app.use(
  cors({
    origin: ["http://localhost:19006", "http://locahost:3000"],
  })
);

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(
//   session({
//     genid: function (req) {
//       console.log("Session ID created");
//       return genuuid();
//     },
//     secret: "its$ecret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: true },
//   })
// );

//Defining Routes

app.get("/", (req, res) => {
  console.log(req.socket.remoteAddress);
  res.send("Server is Up and Running....");
});

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use("/api/login", require("./routes/api/login"));
app.use("/api/signup", require("./routes/api/signup"));

// app.use("/api/auth", require("./routes/api/auth"));

// app.use("/api/setup", require("./routes/api/setup"));

// app.use("/api/device", require("./routes/api/device"));

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`Server Started on PORT ${PORT}`));
