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
async function signup(req, res) {
  try {
    isValid(req, res);

    const { name, email, password } = req.body;
    await checkAvailableEmail(email, req, res);

    let firstName = name.split(" ")[0];
    let lastName = name.split(" ")[1];

    //hash password
    let saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      hashedPassword,
    });

    res.redirect("/"); //testing
  } catch (error) {
    console.error("ERROR: " + error.message);
  }
}

//checks if name, email, or password fields are empty
function isValid(req, res) {
  for (const field in req.body) {
    if (req.body[field].length == 0) {
      res.status(400).send("400 Bad Request");
      throw new Error("Empty field submitted in sign up");
    }
  }
}

//checks if an email is already used in the database
//redirects user back to signup page
async function checkAvailableEmail(email, req, res) {
  const query = await User.find({ email: email });

  if (query.length > 0) {
    req.flash("errorMessage", "Email in use already");
    res.redirect("/signup");
  }
}

module.exports = signup;
