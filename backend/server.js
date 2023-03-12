const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const signup = require("./signup");
const login = require("./login");
const fetchAnimals = require("./petfinderAPI");

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
    secret: process.env.SESSION_SECRET, //need SESSION_SECRET from .env
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

//GET methods
app.get("/", (req, res) => {
  if (req.session.user) {
    res.render("index.ejs", { loggedIn: true });
  } else {
    res.render("index.ejs", { loggedIn: false });
  }
});

app.get("/pet-search", (req, res) => {
  if (req.session.user) {
    res.render("pet-search.ejs", { loggedIn: true });
  } else {
    res.render("pet-search.ejs", { loggedIn: false });
  }
});

app.get("/shelter-search", (req, res) => {
  if (req.session.user) {
    res.render("shelter-search.ejs", { loggedIn: true });
  } else {
    res.render("shelter-search.ejs", { loggedIn: false });
  }
});

app.get("/favorites", (req, res) => {
  if (req.session.user) {
    res.render("favorites.ejs", { loggedIn: true });
  } else {
    res.render("favorites.ejs", { loggedIn: false });
  }
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

app.post("/login", async (req, res) => {
  const user = await login(req, res);

  if (user) {
    req.session.user = user;
    res.redirect("/");
  }
});

app.post("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy(); //ends session and logs user out
    console.log("Logged out");
    res.redirect("back");
  }
});

app.post("/pets-nearby", async (req, res) => {
  const animals = await fetchAnimals(req.body.zipcode);

  res.send(JSON.stringify(animals));
});

module.exports = app;
//exported app to server.test.js to test and start.js to start
