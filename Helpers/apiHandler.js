const { connection } = require("../socketHandler");
const io = connection();
const DeviceType = require("../Models/DeviceType");
const Device = require("../Models/Device");
const Pi = require("../Models/Pi");
const User = require("../Models/User");
const { instrument } = require("@socket.io/admin-ui");
const { v4: uuidv4 } = require("uuid");
const { default: mongoose } = require("mongoose");

instrument(io, {
  namespaceName: "/api",
  auth: false,
});

const apiNamespace = io.of("/api");

apiNamespace.on("connection", (socket) => {
  console.log("Client connected on '/api' with ID  :", socket.id);

  socket.onAny((event, args) => {
    console.log(event, args, " from :  ", socket.handshake.headers.username);
  });

  socket.on("api:toggleStatus", async (data, cb) => {
    Device.findByIdAndUpdate(data.deviceID, { $set: { status: data.status } })
      .then((res) => {
        cb("Updated Successfully.. ✅");
      })
      .catch((err) => console.log(err));
  });

  socket.on("api:editProfile", async (data, cb) => {
    console.log(data);
    User.findByIdAndUpdate(socket.handshake.headers.userid, {
      $set: {
        name: `${data.firstName} ${data.lastName}`,
      },
    }).then(
      (res) => {
        cb({ status: 200, msg: "Profile Updated Successfully" });
      },
      (err) => {
        console.log(err);
        cb({ status: 100, msg: "Some Error Occured While Updating" });
      }
    );
  });

  socket.on("api:getApiKey", async (data, cb) => {
    //get an existing API Key
    const apiKey = (await Pi.findById(data.piID)).apiKey;
    cb(apiKey);
  });
  socket.on("api:genApiKey", async (data, cb) => {
    //generating API Key
    const apiKey = uuidv4().replaceAll("-", "");
    await Pi.findByIdAndUpdate(data.piID, { $set: { apiKey } });
    cb(apiKey);
  });

  socket.on("api:addRaspberryPi", async (data, cb) => {
    console.log(data);
    const pi = await Pi.findOne({ userEmail: data.email, piName: data.piName });
    console.log("Got Pi : ", pi);

    if (pi.user.find((el) => el.toString() === data.userID)) {
      cb({ status: 400, msg: "This Raspberry Pi Already Exists" });
      return;
    }

    if (!pi) {
      cb({ status: 400, msg: "This Raspberry Pi doesn't exists" });
    } else {
      if (pi.apiKey !== data.apiKey) {
        cb({ status: 100, msg: "Please Check the Api Key and Try Again" });
      } else if (pi.apiKey === data.apiKey) {
        await User.findByIdAndUpdate(data.userID, { $push: { pi: pi._id } });
        pi.user.push(data.userID);
        await pi.save();
        cb({ status: 200, msg: `Raspberry Pi ${data.piName} is added` });
      }
    }
  });

  socket.on("api:getPisAndDevices", async (data, cb) => {
    const piList = (
      await User.findOne({ _id: socket.handshake.headers.userid })
    ).pi;

    const piObjList = piList.map(async (el) => {
      return Pi.findOne({ _id: el })
        .populate({
          path: "deviceList",
          select: "-__v -pi",
          populate: {
            path: "deviceType",
            select: "-__v",
          },
        })
        .select(
          "-createdAt -updatedAt -__v -email -password -rpipassword -user"
        )
        .then((res) => {
          res._doc.piID = res._doc._id;
          if (
            res._doc.userEmail !== socket.handshake.headers.email &&
            res._doc.apiKey
          ) {
            delete res._doc.apiKey;
          }
          delete res._doc._id;
          return res;
        });

      //     piID: string;
      // networkID: string;
      // piUsername: string;
      // piName: string;
      // netDetails: string;
      // deviceList: Array<DeviceListType>;
    });

    Promise.all(piObjList)
      .then((results) => {
        cb(results);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  socket.on("api:addNewDevice", async (details, cb) => {
    console.log(details);
    const device = await Device.create({
      pi: details.piID,
      name: details["device_name"],
      deviceType: details.typeID,
      area: details.area.toLowerCase(),
      gpio: details.gpio,
      status: false,
    });

    await Pi.updateOne(
      { _id: details.piID },
      { $push: { deviceList: device._id } }
    );

    const deviceDetails = await Device.findById(device._id)
      .select("-pi -__v")
      .populate({
        path: "deviceType",
        select: "-__v",
      });
    cb(deviceDetails);
  });

  socket.on("api:deleteDevice", (data, cb) => {
    Device.findByIdAndDelete(data.deviceID).then(
      () => {
        Pi.findByIdAndUpdate(data.piID, {
          $pull: { deviceList: data.deviceID },
        }).then(
          () => {
            cb("Deleted Device Successfully ✅");
          },
          (err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  });

  socket.on("api:getDeviceTypes", async (_, cb) => {
    const deviceTypeList = await DeviceType.find({});
    cb(deviceTypeList);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected from '/api' with ID  :", socket.id);
  });
});
