const { Server } = require("socket.io");
// const config = require("config");

// const { createAdapter } = require("@socket.io/mongo-adapter");
// const mongoose = require("mongoose");

const { instrument } = require("@socket.io/admin-ui");
const { userAuthentication } = require("./Middleware/Authenticate");

/**
 * @type {Server} io SocketIo Server
 */
let io = null;

class Socket {
  constructor() {}

  static async init(server) {
    console.log("Starting SocketIo Server");
    if (!io) {
      io = new Server(server, {
        cors: {
          origin: [
            "http://localhost:3000",
            "http://localhost:8000",
            "http://localhost:19006",
            "*",
          ],
        },
        credentials: true,
      });

      // io.adapter(createAdapter(mongoCollection));
      require("./Helpers/apiHandler");

      require("./Helpers/clientSocketHandler");

      require("./Helpers/raspiSocketHandler");

      require("./Helpers/blockchainSocketHandler");
      // io.on("connection", (socket) => {
      //   console.log(socket.handshake.address);
      //   console.log("User Connected with ID :", socket.id);
      //   io.on("create", (data) => {
      //     console.log(data);
      //   });
      //   socket.on("disconnect", () => {
      //     console.log("Disconnected User with ID :", socket.id);
      //   });
      // });
      // userAuthentication(io);
      instrument(io, {
        namespaceName: "/",
        auth: false,
      });
    }
  }
  static getConnection() {
    if (io) return io;
    return null;
  }

  // static getMongoDBCollection() {
  //   if (mongoDBCollection) return mongoDBCollection;
  //   else return null;
  // }
}

module.exports = {
  connectSocket: Socket.init,
  connection: Socket.getConnection,
  // getSessionCollection: Socket.getMongoDBCollection,
};
// module.exports.connectSocket = connectSocket;
// module.exports.io = getIO();

// module.exports.Socket = Socket;

// module.exports = {
//   connect: Socket.init,
//   connection: Socket.getConnection,
// };
