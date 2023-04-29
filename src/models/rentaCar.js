const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String },
  name: { type: String },
  password: { type: String },
});

const carSchema = new Schema({
  platenumber: { type: String },
  brand: { type: String },
  state: { type: String },
});

const rentSchema = new Schema({
  rentnumber: { type: Number },
  username: { type: String },
  platenumber: { type: String },
  rentdate: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Car = mongoose.model("Car", carSchema);
const Rent = mongoose.model("Rent", rentSchema);

module.exports = { User, Car, Rent };
