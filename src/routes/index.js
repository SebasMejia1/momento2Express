const express = require("express");
const router = express.Router();
const { User, Car, Rent } = require("../models/rentaCar");
let usuarioExists = false;
let carroExists = false;
let rentExists = false;
let logeoInvalido = false;

router.get("/", (req, res) => {
  res.render("index", { usuarioExists });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/cars", (req, res) => {
  res.render("cars");
});

router.get("/rents", (req, res) => {
  res.render("rents");
});

router.post("/addUser", async (req, res, next) => {
  let { username } = req.params;
  const existingUser = await User.find({ username: username });
  if (existingUser) {
    usuarioExists = true;
    res.render("/", { usuarioExists });
    return;
  }
  const usuario = new User(req.body);
  await usuario.save();
  res.render("/", { usuarioExists });
});

router.post("/login", async (req, res) => {
  let { username, password } = req.params;
  const user = await User.find({ username: username });
  if (!user) {
    logeoInvalido = true;
    res.render("/", { logeoInvalido });
    return;
  }
  if (user.password !== password) {
    logeoInvalido = true;
    return;
  }
  logeoInvalido = false;
  res.render("/cars", { logeoInvalido });
});

router.post("/NewCars", async (req, res) => {
  let { plateNumber, brand, state } = req.params;
  const existingCar = await Car.find({ plateNumber: plateNumber });
  if (existingCar) {
    res.render("/", { existingCar });
    return;
  }

  // Crear un nuevo carro
  const car = new Car({
    plateNumber: plateNumber,
    brand: brand,
    state: state,
  });
  await car.save();
  res.render("/cars");
});

router.post("/NewRent", async (req, res) => {
  let { rentnumber, username, platenumber } = req.params;
  // Buscar si el usuario existe en la base de datos
  const user = await User.find({ username: username });
  if (!user) {
    usuarioExists = false; // EL USUARIO NO EXISTE VALIDACION EN RENTA CONTRARIO AL DE LOGIN
  }

  // Buscar si el carro existe en la base de datos
  const car = await Car.findOne({ plateNumber: platenumber });
  if (!car) {
    carroExists = false; // EL CARRO NO EXISTE VALIDACION EN RENTA
  }

  // Buscar si el rentNumber ya existe en la base de datos
  const existingRent = await Rent.find({
    rentNumber: rentnumber,
  });
  if (existingRent) {
    rentExists = true; // LA RENTA EXISTE VALIDACION EN RENT
  }

  // Crear una nueva renta
  const rent = new Rent({
    rentNumber: rentnumber,
    username: username,
    platenumber: platenumber,
  });
  await rent.save();
  res.render("/rents");
});

module.exports = router;
