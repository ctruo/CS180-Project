const express = require("express");
const signup = require("./signup");

const router = express.Router();

//GET methods
router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.get("/pet-search", (req, res) => {
  res.render("pet-search.ejs");
});

router.get("/shelter-search", (req, res) => {
  res.render("shelter-search.ejs");
});

router.get("/favorites", (req, res) => {
  res.render("favorites.ejs");
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

//POST methods
router.post("/signup", (req, res) => {
  signup(req, res);
});

module.exports = router;
