//main function
async function signup(req, res) {
  try {
    isValid(req, res);

    const { name, email, password } = req.body;
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

//receives the data from the form submission and
//formats data to store into our database
function formatData(response) {}

//stores new user into database
function storeDB(response) {
  console.log(response);
  //
  //
  ///
  ///
  ///
  ///
  ///
  ///
  //
  ///
  //
  ///
  //
}

//checks if an email is already used in the database
//redirects user back to signup page
function checkAvailableEmail(response) {
  console.log(response);
  //
  //
  ///
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  ///
  //
  //
  //
}

module.exports = signup;
