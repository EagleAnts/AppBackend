// const { jwtTokenVerify } = require("./jwt");
// class RaspberryPi {
//   RaspberryPiNamespace = "";

//   constructor(io, RaspberryPiNamespace) {
//     this.RaspberryPiNamespace =
//       // Email Validation
//       RaspberryPiNamespace.use((socket, next) => {
//         const email = socket.handshake.auth.email;
//         if (!email || /^ *$/.test(email)) return false;
//         else next();
//       });

//     // Token Validation for Raspberry Pi
//     RaspberryPiNamespace.use(() => {
//       const token = socket.handshake.auth.token;
//       if (!token)
//         return { valid: false, status: 401, msg: "Token not available" };
//       const validation = jwtTokenVerify(token);
//       if (!validation.valid) return validation;
//       next();
//     });
//   }
// }

const { connection } = require("../socketHandler");
const { instrument } = require("@socket.io/admin-ui");
const { registerRaspberryPi } = require("../Helpers/registerRaspberryPi");
const User = require("../Models/User");
const Device = require("../Models/Device");
const Pi = require("../Models/Pi");
const bcrypt = require("bcrypt");
const sessionStore = require("../config/redisSessionStore");

const io = connection();
const raspiNamespace = io.of("/raspberrypi");

instrument(io, {
  namespaceName: "/raspberrypi",
  auth: false,
});

User.watch().on("change", async (data) => {
  console.log(data);
  const userDetails = await User.findById(data.documentKey._id).populate("pi");

  raspiNamespace.sockets.forEach((el) => {
    if (el.username === userDetails.name) {
      console.log("Updating Pis For User", el.username);
      el.emit("update:pis");
    }
  });
});

async function checkUserAuthentication(userDetails) {
  const { username, password } = userDetails.data;
  try {
    // Empty username and password check
    if (!username || !password) {
      return { status: 400, msg: "Please Enter the Correct Credentials" };
    }

    let pi = await Pi.findOne({
      _id: userDetails.piID,
      rpiusername: username,
    });
    if (!pi) {
      return {
        status: 400,
        msg: "Please Enter the Correct Credentials",
      };
    }
    const passwordMatch = await bcrypt.compare(password, pi.piPassword);
    if (!passwordMatch) {
      return {
        status: 400,
        msg: "Invalid Credentials",
      };
    }

    return { status: 200, msg: "User Authenticated" };
  } catch (err) {
    console.error(err.message);
    return { status: 500, msg: "Server Error" };
  }
}

// io.of("/raspberrypi").adapter.on("create-room", (room) => {
//   console.log(`room ${room} was created`);
// });
// io.of("/raspberrypi").adapter.on("join-room", (room, id) => {
//   console.log(`socket ${id} has joined room ${room}`);
// });

// User.watch().on("change", (data) => {
//   const updatedPiList = data.updateDescription.updatedFields.pi;
//   console.log("Line 86", updatedPiList);
// });

raspiNamespace.on("connection", async (socket) => {
  // console.log(socket.handshake);
  console.log(socket.handshake.headers);
  const DeviceType = socket.handshake.headers.device_type;
  console.log("Client connected on '/raspberrypi' with ID  :", socket.id);

  const username = socket.handshake.headers.username;
  socket.username = username;
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  // Create Raspi Room IF Rpi Comes Online
  socket.on("create_room", (room) => {
    console.log("Creating Raspi Room With ID : ", room);
    socket.join(room);
  });

  // Make All the Connected Clients Join the Raspberry Pi Room
  if (DeviceType && DeviceType === "raspberrypi") {
    /**
     * @type {Array<string>} raspiUsers
     */
    const piID = socket.handshake.headers.id;
    const piDetails = await Pi.findById(piID);
    const piName = socket.handshake.headers.username.split(":")[0];

    const raspiUsers = piDetails.user;
    const connectedRaspiUsers = (await raspiNamespace.fetchSockets())
      .filter((el) => raspiUsers.includes(el.handshake.headers.userid))
      .map((el) => el.id);

    console.log("Connected Raspi Users  : ", connectedRaspiUsers);
    connectedRaspiUsers.forEach((el) => {
      raspiNamespace.in(el).socketsJoin(piID);
    });

    socket.to(piID).emit("raspberrypi:online", {
      status: 200,
      msg: `${piName} is now Online`,
      data: { piID, piName, totalDevices: piDetails.deviceList.length },
    });
  }

  socket.on("raspberrypi:join_room", (data, cb) => {
    if (raspiNamespace.adapter.rooms.has(data.roomID)) {
      socket.join(data.roomID);
      cb({
        status: 200,
        msg: `Successfully Connected to Raspberry Pi : ${data.piName}`,
      });
    } else {
      cb({ status: 100, msg: `${data.piName} is currently Offline` });
    }
  });

  // socket.on("raspberrypi:leave_room", (data) => {
  //   console.log("Leaving Room");
  //   socket.leave(data.roomID);
  // });

  socket.on("raspberrypi:send", (data) => {
    console.log("Sending Message to Pi's Room");
    socket.to(data.toRoom).emit(data.event, data);
  });

  socket.on("raspberrypi:sendPrivately", async (data) => {
    console.log("Sending Message to Pi Privately");
    const socketID = await sessionStore.findSession(data.networkID, data.to);
    socket.to(socketID).emit(data.event, data);
  });

  socket.on("raspberrypi:recieve", async (data) => {
    console.log("Recieving Message From Raspberrypi and Sending it to Clients");
    socket.to(data.toRoom).emit(data.event, data);
    if (data.updatedStatus) {
      // update status in mongodb
      await Device.findOneAndUpdate(
        { gpio: data.gpio },
        { status: data.updatedStatus },
        { new: true }
      );
    }
  });

  socket.on("register", async (data, cb) => {
    console.log("Registering Raspi on backend....");
    console.log("Got Rpi Details as :", data);
    const res = await registerRaspberryPi(data);
    cb(res);
  });

  // socket.on("join:raspberrypi", async (userDetails, cb) => {
  //   const res = await checkUserAuthentication(userDetails);
  //   console.log(res);
  //   if (res.status === 200) {
  //     console.log("Connecting User to Raspberry Pi Room : ", userDetails.piID);
  //     if (raspiNamespace.adapter.rooms.has(userDetails.piID)) {
  //       socket.join(userDetails.piID);
  //       res.msg = "Connected to Raspberry Pi Successfully";
  //       raspiNamespace.sockets.forEach((el) => {
  //         if (el.username === "raspberrypi") console.log(el.id);
  //       });
  //       console.log(res);
  //     } else {
  //       res.status = 404;
  //       res.msg = "Raspberry Pi is Currently Offline Please Try again Later!";
  //     }
  //   }
  //   cb(res);
  // });

  socket.on("disconnect", () => {
    if (DeviceType && DeviceType === "raspberrypi") {
      const piID = socket.handshake.headers.id;
      const piName = socket.handshake.headers.username.split(":")[0];

      // Send Messages to all Clients and then Clear the Room
      const informClients = async () => {
        socket.to(piID).emit("raspberrypi:offline", {
          piID,
          piName,
          msg: `${piName} is now offline`,
        });
      };

      informClients().then(() => {
        raspiNamespace.socketsLeave(piID);
      });
    }
    console.log("Client Disconnected from /raspberrypi : ", socket.id);
  });
});
