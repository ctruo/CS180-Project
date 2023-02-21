const express = require("express");
const axios = require("axios");
var cors = require("cors");

const CLIENT_ID = "lETjFGBrWrOj7SX2BBXsMKzZ82soJOVM3zLM9GrOC0rV9lgFCw";
const CLIENT_SECRET = "LVIg0AYzZXO9RIb0oDjbExnCZbg5HzKrQu0Kmx7U";
const PETFINDER_URL = "https://api.petfinder.com/v2/oauth2/token";

const app = express();
app.use(cors({ credentials: true, origin: true }));

app.get("/oauth/redirect", (req, res) => {
  axios({
    method: "POST",
    url: `${PETFINDER_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`,
    headers: {
      Accept: "application/json",
    },
  }).then((response) => {
    res.redirect(
      `http://localhost:3000?access_token=${response.data.access_token}`
    );
  });
});

app.get("/pet-search", (req, res) => {
    res.render("pet-search.html");
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
