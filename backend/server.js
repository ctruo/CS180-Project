const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const signup = require("./signup");
const login = require("./login");
const User = require("./Users");
const {
  fetchAnimals,
  fetchAnimalByID,
  fetchAnimalBreeds,
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
  let location = req.query.location ? req.query.location : userZipcode;
  let type = req.query.type ? req.query.type : "dog"; //default to dog if no type specified
  let page = "1";

  if (req.query.page) {
    page = req.query.page;
  }

  let query = `&type=${type}&location=${location}&sort=distance&limit=18&page=${page}`;

  let breed,
    age,
    size,
    gender,
    organization = "";

  if (req.query.breed) {
    breed = req.query.breed;
    query += `&breed=${breed}`;
  }

  if (req.query.age) {
    age = req.query.age;
    query += `&age=${age}`;
  }

  if (req.query.size) {
    size = req.query.size;
    query += `&size=${size}`;
  }

  if (req.query.gender) {
    gender = req.query.gender;
    query += `&gender=${gender}`;
  }

  if (req.query.organization) {
    organization = req.query.organization;
    query += `&organization=${organization}`;
  }

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
      currentPage: pagination.current_page,
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
      currentPage: pagination.current_page,
    });
  }
});

app.get("/shelter-search", async (req, res) => {
  let query;

  let location = req.query.location ? req.query.location : userZipcode;

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

app.get("/favorites", async (req, res) => {
  if (req.session.user) {
    const currentUser = await User.find({ email: req.session.user.email });
    const favorites = currentUser[0].favorites;

    const pets = [];
    let favPet;

    for (let i = 0; i < favorites.length; i++) {
      favPet = await fetchAnimalByID(favorites[i]);
      pets.push(favPet);
    }
    res.render("favorites.ejs", { loggedIn: true, pets: pets });
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
  let type = parseType(req.body.type);

  let location = req.body.petZip ? req.body.petZip : userZipcode;
  //if user entered zip use zip, if not default to current location

  let url = `/pet-search?location=${location}&type=${type}`;

  if (req.body.breed) {
    let breed = req.body.breed;
    url += `&breed=${breed}`;
  }

  if (req.body.age) {
    let age = req.body.age;
    url += `&age=${age}`;
  }

  if (req.body.size) {
    let size = req.body.size;
    url += `&size=${size}`;
  }

  if (req.body.gender) {
    let gender = req.body.gender;
    url += `&gender=${gender}`;
  }

  if (req.body.organization) {
    let organization = req.body.organization;
    url += `&organization=${organization}`;
  }

  if (req.body.page) {
    let page = req.body.page;
    url += `&page=${page}`;
  }

  res.redirect(url);
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

//breed list that matches type to display on pet filters
app.post("/breed-list", async (req, res) => {
  const breedList = await fetchAnimalBreeds(req.body.type);

  res.status(200).send(JSON.stringify(breedList));
  //response goes to pet-search.ejs for breed datalist
});

//breed list that matches type to display on pet filters
app.post("/animal-id", async (req, res) => {
  const petInfo = await fetchAnimalByID(req.body.petID);

  res.status(200).send(JSON.stringify(petInfo));
  //response goes to pet-search.ejs for pet info when a pet is clicked on
});

function parseType(inputType) {
  let type;

  switch (inputType) {
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

  return type;
}

app.post("/add-to-favorites", async (req, res) => {
  if (req.session.user) {
    const currentUser = await User.find({ email: req.session.user.email });

    currentUser[0].favorites.push(req.body.petID);
    currentUser[0].save();

    res.status(200).send(currentUser[0].favorites);
  } else {
    console.log("Not logged in to add to favorites");
  }
});

app.post("/remove-from-favorites", async (req, res) => {
  if (req.session.user) {
    await User.updateOne(
      { email: req.session.user.email },
      {
        $pull: {
          favorites: req.body.petID,
        },
      }
    );
  } else {
    console.log("Not logged in to remove from favorites");
  }
});

module.exports = app;
//exported app to server.test.js to test and start.js to start