const express = require("express");
const router = express.Router();
const { User, Car, Rent } = require("../models/rentaCar");
let usuarioExists = false;

router.get("/", (req, res) => {
  res.render("index", { usuarioExists });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/addUser", async (req, res, next) => {
  let { id, username } = req.params;
  const existingUser = await User.find({ username: username });
  if (existingUser) {
    usuarioExists = true;
    res.render("index", { usuarioExists });
    return;
  }
  const user = new User(req.body);
  await user.save();
  res.render("index", { usuarioExists });
});

module.exports = router;
