// require("./mqttClient");
const { createServer } = require("http");
const express = require("express");
const app = express();
const httpServer = createServer(app);

const { Server } = require("socket.io");
const io = new Server(httpServer, { cors: { origin: "*" } });

const cors = require("cors");

const connectDB = require("./config/db");

io.on("connection", (socket) => {
  console.log("Hello User", socket.id);
});

io.on("disconnect", (socket) => {
  console.log("Bye User", socket.id);
});

//Connect Database
connectDB();

// Using Middlewares

app.use(
  cors({
    origin: ["http://localhost:19006", "http://locahost:3000"],
  })
);

app.use(express.json());

//Defining Routes

app.get("/", (req, res) => {
  res.send("Server is Up and Running....");
});

app.use("/api/login", require("./routes/api/login"));
app.use("/api/signup", require("./routes/api/signup"));

// app.use("/api/auth", require("./routes/api/auth"));

// app.use("/api/setup", require("./routes/api/setup"));

// app.use("/api/device", require("./routes/api/device"));

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`Server Started on PORT ${PORT}`));
