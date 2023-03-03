const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const signup = require("./signup");

//used to render html pages with EJS
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.set("views", path.join(__dirname, "../frontend/views")); //views folder for html

//serving public folder (CSS and images)
app.use(express.static(path.join(__dirname, "../frontend/public")));

//allow data parsing
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

//GET methods
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/pet-search", (req, res) => {
  res.render("pet-search.ejs");
});

app.get("/shelter-search", (req, res) => {
  res.render("shelter-search.ejs");
});

app.get("/favorites", (req, res) => {
  res.render("favorites.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

//POST methods
app.post("/signup", (req, res) => {
  signup(req, res);
});

module.exports = app;
//exported app to server.test.js to test and start.js to start
