const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index.html");
});

router.get("/pet-search", (req, res) => {
  res.render("pet-search.html");
});

router.get("/shelter-search", (req, res) => {
  res.render("shelter-search.html");
});

router.get("/favorites", (req, res) => {
  res.render("favorites.html");
});

router.get("/login", (req, res) => {
  res.render("login.html");
});

router.get("/signup", (req, res) => {
  res.render("signup.html");
});

module.exports = router;
