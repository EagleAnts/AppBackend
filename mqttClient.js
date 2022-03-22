const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.emqx.io", {
  clientId: "jsClient",
  port: 1883,
});

client.on("connect", function (packet) {
  console.log("Connected With Mqtt Broker");
  client.subscribe("raspberry/temp-sensor");
});

client.on("message", function (topic, payload, packet) {
  console.log(topic);
  console.log(payload.toString());
});

client.on("disconnect", function () {
  console.log("disconnected");
});
