const localStrategy = require("passport-local").Strategy;

function intialize(passport) {
  passport.use(
    new localStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );
}

module.export = intialize;
