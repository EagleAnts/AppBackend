const { connection } = require("../socketHandler");
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

// const mongoose = require("mongoose");

const io = connection();

// io.use(async (socket, next) => {
//   const sessionID = socket.handshake.auth.sessionID;
//   if (sessionID) {
//     const session = await sessionStore.findSession(sessionID);
//     if (session) {
//       socket.sessionID = sessionID;
//       socket.userID = session.userID;
//       socket.userName = session.username;
//       return next();
//     }
//   }
//   const username = socket.handshake.auth.username;

//   if (!username) {
//     return next(new Error("Invalid Username"));
//   }
//   socket.sessionID = randomId();
//   socket.username = username;
//   next();
// });

// io.of("/").adapter.on("create-room", (room) => {
//   console.log(`room ${room} was created`);
// });

io.of("/").adapter.on("join-room", (room, id) => {
  console.log(`socket ${id} has joined room ${room}`);
});

io.on("connection", async (socket) => {
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  // persist session
  // sessionStore.saveSession(socket.sessionID, {
  //   userID: socket.userID,
  //   username: socket.username,
  //   connected: true,
  // });

  // emit session details
  //   socket.emit("session", {
  //     sessionID: socket.sessionID,
  //     userID: socket.userID,
  //   });

  //   io.emit("namespace-created", "Successfully Created Namespace");

  //   socket.on("create", (data) => {
  //     console.log("Creating Namespace.....");
  //     console.log(data.user);
  //     userNamespace = io.of("/" + data.user);
  //   });

  // const room = socket.handshake.headers.roomID;
  // socket.join();

  console.log(socket.handshake.address);
  console.log("User Connected with ID :", socket.id);

  // notify users upon disconnection

  socket.on("disconnect", async () => {
    console.log("Disconnected User with ID :", socket.id);
  });
});
