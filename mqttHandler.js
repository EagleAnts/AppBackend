const mqtt = require("mqtt");

const options = {
  host: "6d8f557b13c14e5f9254cbaf9b158bb1.s1.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "paritoshpc",
  password: "HomeApp12@Hive",
};

// initialize the client
const client = mqtt.connect(options);

// setup the callbacks
client.on("connect", function () {
  console.log("Mqtt Connected");
});

client.on("error", function (error) {
  console.log(error);
});

client.subscribe("encyclopedia/temperature");

module.exports = client;
