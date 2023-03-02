const express = require("express");
const path = require("path");
const app = express();
const routes = require("./routes");

//used to render html pages with EJS
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.set("views", path.join(__dirname, "../frontend/views")); //views folder for html

//serving public folder (CSS and images)
app.use(express.static(path.join(__dirname, "../frontend/public")));

//allow data parsing
app.use(express.urlencoded({ extended: true }));

//routes.js
app.use("/", routes);

module.exports = app;
//exported app to server.test.js to test and start.js to start
