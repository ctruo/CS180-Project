const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const signup = require("./signup");
const login = require("./login");
const {
  fetchAnimals,
  fetchAnimalTypes,
  fetchShelters,
} = require("./petfinderAPI");

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
    res.render("index.ejs", { loggedIn: true, location: userZipcode });
  } else {
    res.render("index.ejs", { loggedIn: false, location: userZipcode });
  }
});

app.get("/pet-search", async (req, res) => {
  let query;

  let location = req.query.location ? req.query.location : userZipcode;
  //if user entered zip use zip, if not default to current location

  let type = req.query.type ? req.query.type : "dog"; //default to dog if no type specified
  let breed = req.query.breed ? req.query.breed : "";
  let age = req.query.age ? req.query.age : "";
  let size = req.query.size ? req.query.size : "";
  let gender = req.query.gender ? req.query.gender : "";
  let color = req.query.color ? req.query.color : "";
  let good_with = req.query.good_with ? req.query.good_with : "";
  let care_behavior = req.query.care_behavior ? req.query.care_behavior : "";

  query += `&type=${type}&location=${location}&sort=distance&limit=21`;
  const [pets, pagination] = await fetchAnimals(query);
  //FIXME: pagination for later implementation possibly

  if (req.session.user) {
    res.render("pet-search.ejs", {
      loggedIn: true,
      pets: pets,
      location: location,
      type: type,
      breed: breed,
      age: age,
      size: size,
      gender: gender,
      color: color,
      good_with: good_with,
      care_behavior: care_behavior,
    });
  } else {
    res.render("pet-search.ejs", {
      loggedIn: false,
      pets: pets,
      location: location,
      type: type,
      breed: breed,
      age: age,
      size: size,
      gender: gender,
      color: color,
      good_with: good_with,
      care_behavior: care_behavior,
    });
  }
});

app.get("/shelter-search", async (req, res) => {
  let query;

  let location = req.query.location ? req.query.location : userZipcode;
  //if user entered zip use zip, if not default to current location

  if (req.query.shelter_name) {
    query += `&query=${req.query.shelter_name}`; //add name field to query only if user didn't leave it blank
  }

  query += `&location=${location}&sort=distance`;
  const [shelters, pagination] = await fetchShelters(query);
  //FIXME: pagination for later implementation possibly

  if (req.session.user) {
    res.render("shelter-search.ejs", {
      loggedIn: true,
      shelters: shelters,
      location: location,
      shelterQuery: req.query.shelter_name,
    });
  } else {
    res.render("shelter-search.ejs", {
      loggedIn: false,
      shelters: shelters,
      location: location,
      shelterQuery: req.query.shelter_name,
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
  const [pets, pagination] = await fetchAnimals(query);
  //pagination unused

  res.status(200).send(JSON.stringify(pets));
  //response goes to getNearbyPets() in main-page.js in frontend/public/client-scripts
});

//POST methods
//receive user's zipcode and set global zipcode variable
app.post("/user-location", (req, res) => {
  userZipcode = req.body.zipcode;

  res.status(200).send("Zipcode received");
});

app.post("/pet-search", (req, res) => {
  let type;

  switch (req.body.type) {
    case "Dogs":
      type = "dog";
      break;
    case "Cats":
      type = "cat";
      break;
    case "Rabbits":
      type = "rabbit";
      break;
    case "Small & Furry":
      type = "small-furry";
      break;
    case "Horses":
      type = "horse";
      break;
    case "Birds":
      type = "bird";
      break;
    case "Scales, Fins, & Other":
      type = "scales-fins-other";
      break;
    case "Barnyard":
      type = "barnyard";
      break;
    default:
      type = "dog";
  }

  res.redirect(`/pet-search?location=${req.body.petZip}&type=${type}`);
  //redirect to the GET method for pet-search which gets data from url params
});

app.post("/shelter-search", (req, res) => {
  res.redirect(
    `/shelter-search?location=${req.body.shelterZip}&shelter_name=${req.body.shelterName}`
  );
  //redirect to the GET method for shelter-search which gets data from url params
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
