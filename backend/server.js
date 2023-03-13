const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const signup = require("./signup");
const login = require("./login");
const { fetchAnimals, fetchShelters } = require("./petfinderAPI");

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

let userZipcode; //global variable to track user's location

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

app.get("/shelter-search", async (req, res) => {
  const query = `&location=${userZipcode}&limit=4&sort=distance`;
  const shelters = await fetchShelters(query);

  if (req.session.user) {
    res.render("shelter-search.ejs", {
      loggedIn: true,
      shelters: shelters,
    });
  } else {
    res.render("shelter-search.ejs", {
      loggedIn: false,
      shelters: shelters,
    });
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

//gets nearby pets to display on main page mid section
app.get("/nearby-pets", async (req, res) => {
  const query = `&location=${userZipcode}&limit=4&sort=random&distance=100`;
  const animals = await fetchAnimals(query);

  res.status(200).send(JSON.stringify(animals));
  //response goes to getNearbyPets() in main-page.js in frontend/public/client-scripts
});

//POST methods
//receive user's zipcode and set global zipcode variable
app.post("/user-location", (req, res) => {
  userZipcode = req.body.zipcode;

  res.status(200).send("Zipcode received");
});

app.post("/shelter-search", (req, res) => {
  res.redirect("/shelter-search"); //redirect to the GET method for shelter-search which gets data
});

app.post("/signup", (req, res) => {
  signup(req, res);
});

app.post("/login", async (req, res) => {
  const user = await login(req, res);

  if (user) {
    req.session.user = user; //create session if user logs in
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

module.exports = app;
//exported app to server.test.js to test and start.js to start
