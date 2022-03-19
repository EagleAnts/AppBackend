const { io } = require("socket.io-client");
const socket = io("https://5950-110-235-234-99.ngrok.io");

socket.on("connect", () => {
  console.log("Connected With RaspberryPi", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected With RaspberryPi");
});
