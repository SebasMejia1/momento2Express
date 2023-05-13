const express = require("express");
const router = express.Router();
const { User, Car, Rent } = require("../models/rentaCar");
let usuarioExists = false;
let logeoInvalido = false;
let carroExists = false;
let rentExists = false;
let usuarioExistsOnRent = true;
let carroExistsOnRent = true;

router.get("/", (req, res) => {
  res.render("index", { logeoInvalido, usuarioExists });
});

router.get("/register", (req, res) => {
  res.render("register", { usuarioExists });
});

router.get("/cars", (req, res) => {
  res.render("cars", { carroExists });
});

router.get("/rents", (req, res) => {
  res.render("rents", { rentExists, carroExistsOnRent, usuarioExistsOnRent });
});

router.post("/addUser", async (req, res, next) => {
  const existingUser = await User.find({ username: req.body.username });
  if (existingUser.length > 0) {
    console.log(existingUser);
    // console.log("El usuario existe en la base de datos");
    usuarioExists = true;
    res.redirect("/");
  } else {
    console.log(existingUser);
    console.log(req.body.username);
    // console.log("El usuario no existe en la base de datos");
    usuarioExists = false;
    const usuario = new User(req.body);
    await usuario.save();
    res.redirect("/");
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (user) {
    console.log(user);
    console.log(username, password);
    console.log("El usuario existe");
    if (user.password == password) {
      logeoInvalido = false;
      res.redirect("cars");
    } else {
      console.log(user);
      console.log(user.password);
      logeoInvalido = true;
      console.log("La contraseña es incorrecta");
      res.redirect("/");
    }
  } else {
    console.log(user);
    console.log(username, password);
    console.log("El usuario no existe debe registrarse");
  }
});

router.post("/NewCars", async (req, res) => {
  let { plateNumber, brand } = req.body;
  const existingCar = await Car.findOne({ platenumber: plateNumber });
  if (existingCar) {
    carroExists = true;
    res.redirect("/cars");
  } else {
    // Crear un nuevo carro
    const car = new Car({
      platenumber: plateNumber,
      brand: brand,
    });
    carroExists = false;
    await car.save();
    res.redirect("/cars");
  }
});

router.post("/NewRent", async (req, res) => {
  let { rentNumber, username, platenumber } = req.body;
  // Buscar si el usuario existe en la base de datos
  const user = await User.findOne({ username: username });
  const car = await Car.findOne({ platenumber: platenumber });
  const existingRent = await Rent.findOne({ rentnumber: rentNumber });
  if (!user || !car || existingRent) {
    usuarioExistsOnRent = false; // EL USUARIO NO EXISTE VALIDACION EN RENTA CONTRARIO AL DE LOGIN
    carroExistsOnRent = false; // EL CARRO NO EXISTE VALIDACION EN RENTA
    rentExists = true; // LA RENTA NO EXISTE VALIDACION EN RENTA
    res.redirect("/rents");
  } else {
    // Crear una nueva renta
    const rent = new Rent({
      rentnumber: rentNumber,

      username: username,
      platenumber: platenumber,
    });
    rentExists = false;
    usuarioExistsOnRent = true;
    carroExistsOnRent = true;
    await rent.save();
    res.redirect("/rents");
  }
});

module.exports = router;
