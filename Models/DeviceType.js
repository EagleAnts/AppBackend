const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeviceTypeSchema = new Schema({
  type: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  icon: {
    type: String,
    required: true,
  },
});

// const devices = [
//   {
//     type: "Air conditioner",
//     description: "AC",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635865545/deviceIcons/02_il5zg6.png",
//   },
//   {
//     type: "Blender",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635865548/deviceIcons/16_vd0uod.png",
//   },
//   {
//     type: "Ceiling fan",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635865549/deviceIcons/22_ryfng4.png",
//   },
//   {
//     type: "Clothes dryer",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635865549/deviceIcons/19_tbqihs.png",
//   },
//   {
//     type: "Desk lamp",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635865548/deviceIcons/13_zowypy.png",
//   },
//   {
//     type: "Dishwasher",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Electric kettle",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Evaporative cooler",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Table Fan",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635865549/deviceIcons/22_ryfng4.png",
//   },
//   {
//     type: "Food processor",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Freezer",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Hairdryer",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Heat pump control panel",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Humidifier",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Ice cream maker",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Iron",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635865549/deviceIcons/23_rvotrz.png",
//   },
//   {
//     type: "Lights",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635865549/deviceIcons/21_mhbhxk.png",
//   },
//   {
//     type: "Lamp",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635865546/deviceIcons/05_ssrotx.png",
//   },
//   {
//     type: "Lawn mower",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Microwave",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635865547/deviceIcons/09_nd19tk.png",
//   },
//   {
//     type: "Radiator",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Refrigerator",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635865547/deviceIcons/08_vcxo6k.png",
//   },
//   {
//     type: "Rice cooker",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Sewing machine",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Space heater",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Stove",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "TV",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635865549/deviceIcons/24_q5knks.png",
//   },
//   {
//     type: "Upright vacuum cleaner",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Vacuum cleaner",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
//   {
//     type: "Washing machine",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635865549/deviceIcons/19_tbqihs.png",
//   },
//   {
//     type: "Water heater",
//     description: "Some Random Description",
//     icon: "https://res.cloudinary.com/homeautomation/image/upload/v1635869254/deviceIcons/random_wfhamk.png",
//   },
// ];

const DeviceModel = mongoose.model("deviceType", DeviceTypeSchema);

// DeviceModel.insertMany(devices)
//   .then(() => console.log("Device Type Inserted"))
//   .catch((err) => console.log(err));

module.exports = DeviceModel;
