const bcrypt = require("bcrypt");
const User = require("./Users");

//main function
async function login(req, res) {
  try {
    isValidRequest(req, res);

    const { email, password } = req.body;
    const user = await validateUser(email, password, req, res);

    console.log("Logged in");

    return user;
  } catch (error) {
    console.error("LOGIN ERROR: " + error.message);
  }
}

//checks if email or password fields are empty
function isValidRequest(req, res) {
  for (const field in req.body) {
    if (req.body[field].length == 0) {
      res.status(400).send("400 Bad Request");
      throw new Error("Empty field submitted in login");
    }
  }
}

//checks if email exists, and if so checks if password matches
//if no errors are caught, the function finishes
async function validateUser(email, password, req, res) {
  const query = await User.find({ email: email });

  if (query.length < 1) {
    //check if email exists
    req.flash("errorMessage", "No user with that email found"); //dependent on flash in server.js
    res.redirect("/login");
  } else {
    //email exists, now check password match
    const validPassword = await bcrypt.compare(password, query[0].password);

    if (!validPassword) {
      req.flash("errorMessage", "Incorrect password"); //dependent on flash in server.js
      res.redirect("/login");
    } else {
      //send user data without password to session in server.js
      const { firstName, lastName, email } = query[0];

      const userSessionInfo = {
        firstName,
        lastName,
        email,
      };

      return userSessionInfo;
    }
  }
}

module.exports = login;