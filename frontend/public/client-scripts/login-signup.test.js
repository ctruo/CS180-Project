const { JSDOM } = require("jsdom");
const { isValidName, isValidEmail, isValidPassword, confirmPassword } = require("./login-signup");

// Test detection of invalid name input
describe("isValidName", () => {
  it("return true if name field contains first and last name separated by a space", () => {
    const nameInput = document.createElement("input");
    nameInput.id = "name";
    nameInput.value = "Tian Liu";

    document.body.appendChild(nameInput);
    expect(isValidName()).toBe(true);
    document.body.removeChild(nameInput);
  });

  it("return false if name field is empty", () => {
    const nameInput = document.createElement("input");
    nameInput.id = "name";
    nameInput.value = "";

    document.body.appendChild(nameInput);
    expect(isValidName()).toBe(false);
    document.body.removeChild(nameInput);
  });

  it("return false if name field only contains first or last name", () => {
    const nameInput = document.createElement("input");
    nameInput.id = "name";
    nameInput.value = "Liu";

    document.body.appendChild(nameInput);
    expect(isValidName()).toBe(false);
    document.body.removeChild(nameInput);
  });
});

// Test detection of invalid email input
describe("isValidEmail", () => {
  it("return true if email field contains '@' and a valid domain", () => {
    const emailInput = document.createElement("input");
    emailInput.id = "email";
    emailInput.value = "tliu172@ucr.edu";

    document.body.appendChild(emailInput);
    expect(isValidEmail()).toBe(true);
    document.body.removeChild(emailInput);
  });

  it("return false if email field is empty", () => {
    const emailInput = document.createElement("input");
    emailInput.id = "email";
    emailInput.value = "";

    document.body.appendChild(emailInput);
    expect(isValidEmail()).toBe(false);
    document.body.removeChild(emailInput);
  });

  it("return false if email field does not contain '@'", () => {
    const emailInput = document.createElement("input");
    emailInput.id = "email";
    emailInput.value = "tliu172ucr.edu";

    document.body.appendChild(emailInput);
    expect(isValidEmail()).toBe(false);
    document.body.removeChild(emailInput);
  });

  it("return false if email field does not contain a valid domain", () => {
    const emailInput = document.createElement("input");
    emailInput.id = "email";
    emailInput.value = "tliu172@ucr";

    document.body.appendChild(emailInput);
    expect(isValidEmail()).toBe(false);
    document.body.removeChild(emailInput);
  });
});

// Test enforcement of password integrity
describe("isValidPassword", () => {
  it("return true if password is sufficiently strong", () => {
    const passwordInput = document.createElement("input");
    passwordInput.id = "password";
    passwordInput.value = "pword13579!";

    document.body.appendChild(passwordInput);
    expect(isValidPassword()).toBe(true);
    document.body.removeChild(passwordInput);
  });

  it("return false if password field is empty", () => {
    const passwordInput = document.createElement("input");
    passwordInput.id = "password";
    passwordInput.value = "";

    document.body.appendChild(passwordInput);
    expect(isValidPassword()).toBe(false);
    document.body.removeChild(passwordInput);
  });

  it("return false if password is too short", () => {
    const passwordInput = document.createElement("input");
    passwordInput.id = "password";
    passwordInput.value = "pword1!";

    document.body.appendChild(passwordInput);
    expect(isValidPassword()).toBe(false);
    document.body.removeChild(passwordInput);
  });

  it("return false if password has no lowercase or uppercase letters", () => {
    const passwordInput = document.createElement("input");
    passwordInput.id = "password";
    passwordInput.value = "135792468!";

    document.body.appendChild(passwordInput);
    expect(isValidPassword()).toBe(false);
    document.body.removeChild(passwordInput);
  });

  it("return false if password has no numbers", () => {
    const passwordInput = document.createElement("input");
    passwordInput.id = "password";
    passwordInput.value = "password!";

    document.body.appendChild(passwordInput);
    expect(isValidPassword()).toBe(false);
    document.body.removeChild(passwordInput);
  });

  it("return false if password has no special characters", () => {
    const passwordInput = document.createElement("input");
    passwordInput.id = "password";
    passwordInput.value = "pword13579";

    document.body.appendChild(passwordInput);
    expect(isValidPassword()).toBe(false);
    document.body.removeChild(passwordInput);
  });
});

// Test detection of confirmed password mismatch
describe("confirmPassword", () => {
  it("return true if confirmed password matches", () => {
    const passwordInput = document.createElement("input");
    passwordInput.id = "password";
    passwordInput.value = "pword13579!";

    const confirmPasswordInput = document.createElement("input");
    confirmPasswordInput.id = "confirm_password";
    confirmPasswordInput.value = "pword13579!";

    document.body.appendChild(passwordInput);
    document.body.appendChild(confirmPasswordInput);

    expect(confirmPassword()).toBe(true);

    document.body.removeChild(passwordInput);
    document.body.removeChild(confirmPasswordInput);
  });

  it("return false if confirmed password does not match", () => {
    const passwordInput = document.createElement("input");
    passwordInput.id = "password";
    passwordInput.value = "pword13579!";

    const confirmPasswordInput = document.createElement("input");
    confirmPasswordInput.id = "confirm_password";
    confirmPasswordInput.value = "pword24680!";

    document.body.appendChild(passwordInput);
    document.body.appendChild(confirmPasswordInput);

    expect(confirmPassword()).toBe(false);

    document.body.removeChild(passwordInput);
    document.body.removeChild(confirmPasswordInput);
  });
});

// Test overall functionality of login-signup client script
// and ability to correctly disable/enable the submit button
describe("login-signup client script", () => {
  let btn;
  let nameInput;
  let emailInput;
  let passwordInput;
  let confirmPasswordInput;
  let inputs;
  let path;
  let page;
  let signupValidator;
  let loginValidator;
  let inputValidator;

  beforeAll(() => {
    document.body.innerHTML = `
      <input type="text" id="name">
      <input type="text" id="email">
      <input type="password" id="password">
      <input type="password" id="confirm_password">
      <button type="submit" class="login-signup-button" disabled>Sign up</button>
    `;

    nameInput = document.querySelector("#name");
    emailInput = document.querySelector("#email");
    passwordInput = document.querySelector("#password");
    confirmPasswordInput = document.querySelector("#confirm_password");
    btn = document.querySelector(".login-signup-button");
    inputs = document.querySelectorAll("input");

    signupValidator = {
      name: false,
      email: false,
      password: false,
      confirm_password: false,
    };
    loginValidator = {
      email: false,
      password: false,
    };

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
  });

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

  it("signup: sign up button remains disabled while inputs are invalid", () => {
    inputValidator = signupValidator;
    btn.disabled = true;

    // Assign invalid inputs to all fields    
    nameInput.value = "Liu";
    emailInput.value = "tliu172@ucr";
    passwordInput.value = "pword13579";
    confirmPasswordInput.value = "PWORD24680!";

    // Verify button disabled status after each input event
    nameInput.dispatchEvent(new Event("input"));
    expect(btn.disabled).toBeTruthy();
    emailInput.dispatchEvent(new Event("input"));
    expect(btn.disabled).toBeTruthy();
    passwordInput.dispatchEvent(new Event("input"));
    expect(btn.disabled).toBeTruthy();
    confirmPasswordInput.dispatchEvent(new Event("input"));
    expect(btn.disabled).toBeTruthy();
  });

  it("signup: sign up button enabled when inputs are valid", () => {
    inputValidator = signupValidator;
    btn.disabled = true;

    // Assign valid inputs to all fields
    nameInput.value = "Tian Liu";
    emailInput.value = "tliu172@ucr.edu";
    passwordInput.value = "pword13579!";
    confirmPasswordInput.value = "pword13579!";

    // Trigger input event for all fields
    nameInput.dispatchEvent(new Event("input"));
    emailInput.dispatchEvent(new Event("input"));
    passwordInput.dispatchEvent(new Event("input"));
    confirmPasswordInput.dispatchEvent(new Event("input"));
    
    // Confirm button enabled when all inputs are valid
    expect(btn.disabled).toBeFalsy();
  });

  it("login: log in button remains disabled while inputs are invalid", () => {
    inputValidator = loginValidator;
    btn.disabled = true;

    // Assign invalid inputs to all fields
    emailInput.value = "tliu172";
    passwordInput.value = "pword13579";

    // Verify button disabled status after each input event
    emailInput.dispatchEvent(new Event("input"));
    expect(btn.disabled).toBeTruthy();
    passwordInput.dispatchEvent(new Event("input"));
    expect(btn.disabled).toBeTruthy();
  });

  it("login: log in button enabled when inputs are valid", () => {
    inputValidator = loginValidator;
    btn.disabled = true;

    // Assign valid inputs to all fields
    emailInput.value = "tliu172@ucr.edu";
    passwordInput.value = "pword13579!";

    // Trigger input event for all fields
    emailInput.dispatchEvent(new Event("input"));
    passwordInput.dispatchEvent(new Event("input"));

    // Confirm button enabled when all inputs are valid
    expect(btn.disabled).toBeFalsy();
  });
});

