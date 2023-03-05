const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./Users");

//DB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((error) => {
    console.log("ERROR: " + error);
  });

//main function
async function login(req, res) {
  try {
    isValid(req, res);

    const { email, password } = req.body;
    await checkValidEmail(email, req);

    res.redirect("/");
  } catch (error) {
    console.error("ERROR: " + error.message);
  }
}

//checks if email or password fields are empty
function isValid(req, res) {
  for (const field in req.body) {
    if (req.body[field].length == 0) {
      res.status(400).send("400 Bad Request");
      throw new Error("Empty field submitted in login");
    }
  }
}

//checks if a user with that email exists
async function checkValidEmail(email, req) {
  const query = await User.find({ email: email });

  if (query.length < 1) {
    req.flash("errorMessage", "No user with that email found");
    res.redirect("/login");
  }
}

module.exports = login;
