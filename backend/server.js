const express = require("express");
const path = require("path");
const app = express();

//used to render html pages with EJS
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.set("views", path.join(__dirname, "../frontend/views")); //views folder for html

//serving public folder (CSS and images)
app.use(express.static(path.join(__dirname, "../frontend/public")));

//routes
app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/pet-search", (req, res) => {
  res.render("pet-search.html");
});

app.get("/shelter-search", (req, res) => {
  res.render("shelter-search.html");
});

app.get("/favorites", (req, res) => {
  res.render("favorites.html");
});

app.get("/login", (req, res) => {
  res.render("login.html");
});

app.get("/signup", (req, res) => {
  res.render("signup.html");
});

//website is hosted on this port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
