const { connection } = require("../socketHandler");
const { instrument } = require("@socket.io/admin-ui");
const Pi = require("../Models/Pi");
const BlockchainDetails = require("../Models/BlockchainNetwork");
const sessionStore = require("../config/redisSessionStore");

const io = connection();
const blockchainNamespace = io.of("/blockchain");

instrument(io, {
  namespaceName: "/blockchain",
  auth: false,
});

blockchainNamespace.on("connection", async (socket) => {
  const piID = socket.handshake.headers.id;

  const networkID = socket.handshake.headers.networkid;

  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  console.log("Client connected on '/blockchain' with ID  :", socket.id);

  socket.on("blockchain:setSessionID", async () => {
    await sessionStore.udpateSession(
      networkID,
      piID,
      "blockchainSID",
      socket.id
    );

    const userSession = await sessionStore.findSession(networkID, piID);
    console.log("User Session Details : ", userSession);
  });

  socket.on("join_room", (room) => {
    console.log("Joining Client to Room on '/blockchain' ", room);
    socket.join(room);
  });

  socket.on("blockchain:private_recieve", async (data, cb) => {
    console.log("Recieved Data from  : ", data);

    /***
     * Recieving Private Messages on the Client Side which has
     * sent the message first
     */
    try {
      const { blockchainSID, connected, username } =
        await sessionStore.findSession(networkID, data.to);

      if (connected) {
        blockchainNamespace
          .to(blockchainSID)
          .emit(`${data.event}_recieve`, data);
        cb("Recieved ✅");
      } else {
        cb(`User : ${username.split("-")[0]} is not connected ❌`);
      }
    } catch (err) {
      console.log(err);
      cb("Some Error Occured ❌❌");
    }
  });

  socket.on("blockchain:private_send", async (data, cb) => {
    /***
     * Sending Private Messages to the Client
     */
    try {
      const { blockchainSID, connected, username } =
        await sessionStore.findSession(networkID, data.to);

      if (connected) {
        blockchainNamespace.to(blockchainSID).emit(data.event, data);
        cb("Sent ✅");
      } else {
        cb(`User : ${username.split(":")[0]} is not connected ❌`);
      }
    } catch (err) {
      cb("Some Error Occured ❌❌");
    }
  });
  socket.on("blockchain:broadcast", (data, cb) => {
    /***
     * Broadcasting to All the Clients
     */
    socket.to(networkID).emit(data.event, data);
    cb("Broadcasted ✅");
  });

  socket.on("blockchain:getNodes", async (data, cb) => {
    const nodes = await BlockchainDetails.findById(data.networkID);
    const nodesList = nodes
      ? nodes.pi.filter((el) => el.toString() !== data.piID)
      : null;
    cb(nodesList);
  });

  socket.on("blockchain:getConnectedNodes", async (data, cb) => {
    const connectedClients = (
      await sessionStore.findConnectedSessions(networkID)
    ).filter((el) => el !== data.piID);
    cb(connectedClients);
  });

  socket.on("disconnect", async () => {
    console.log("Client Disconnected From /blockchain : ", socket.id);
    sessionStore.clearSession(networkID, piID);
  });
});
