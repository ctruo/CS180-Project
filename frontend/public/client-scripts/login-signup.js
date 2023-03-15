//main {

let inputs = document.querySelectorAll("input");
let btn = document.querySelector(".login-signup-button");

let path = window.location.pathname; //gets current filename
let page = path.split("/").pop(); //lets us know if we're on login or signup page

let signupValidator = {
  name: false,
  email: false,
  password: false,
  confirm_password: false,
};

let loginValidator = {
  email: false,
  password: false,
};

let inputValidator;

page === "signup"
  ? (inputValidator = signupValidator)
  : (inputValidator = loginValidator);

//makes sure each input field is valid before enabling button submit
inputs.forEach((input) => {
  input.addEventListener("input", (event) => {
    let inputName = event.target.getAttribute("id");
    if (validate(inputName)) {
      inputValidator[inputName] = true;
    } else {
      inputValidator[inputName] = false;
    }

    let allTrue = Object.keys(inputValidator).every((item) => {
      return inputValidator[item] === true;
    });

    if (allTrue) {
      btn.disabled = false;
    } else {
      btn.disabled = true;
    }
  });
});
//}

//Helper functions

//calls specific validation functions depending on input type
function validate(input) {
  if (input === "name") {
    return isValidName();
  } else if (input === "email") {
    return isValidEmail();
  } else if (input === "password") {
    return isValidPassword();
  } else if (input === "confirm_password") {
    return confirmPassword();
  }
}

//checks if name field is not empty and has first and last names
function isValidName() {
  let isValid = false;
  let regex = /^[A-Za-z]+\s[A-Za-z]+/;
  let name = document.querySelector("#name");

  if (regex.test(name.value) && name.value.length != 0) {
    name.style.borderColor = null;
    isValid = true;
  } else {
    name.style.borderColor = "red";
    isValid = false;
  }

  return isValid;
}

//checks if an email has @ and .com, .net, etc.
function isValidEmail() {
  let isValid = false;
  let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  let email = document.querySelector("#email");

  if (regex.test(email.value) && email.value.length != 0) {
    email.style.borderColor = null;
    isValid = true;
  } else {
    email.style.borderColor = "red";
    isValid = false;
  }

  return isValid;
}

//checks if password has:
//more than 8 characters
//at least one lowercase
//at least one number
//at least one special character @$!%*#?&
function isValidPassword() {
  let isValid = false;
  let regex = /^.*(?=.{8,})(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&*?"]).*$/;
  let password = document.querySelector("#password");

  if (regex.test(password.value) && password.value.length != 0) {
    password.style.borderColor = null;
    isValid = true;
  } else {
    password.style.borderColor = "red";
    isValid = false;
  }

  return isValid;
}

//checks if password and confirm password match
function confirmPassword() {
  let isValid = false;
  let password = document.querySelector("#password");
  let confirmPassword = document.querySelector("#confirm_password");

  if (confirmPassword.value == password.value && confirmPassword.value != 0) {
    confirmPassword.style.borderColor = "lightgreen";
    isValid = true;
  } else {
    confirmPassword.style.borderColor = "red";
    isValid = false;
  }

  return isValid;
}
