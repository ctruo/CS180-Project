const bcrypt = require("bcrypt");
const User = require("./Users");
const signup = require("./signup");

jest.mock("./Users");

let theUserCreated;

describe("signup", () => {
  beforeEach(() => {
    theUserCreated = {
      firstName: "Tian",
      lastName: "Liu",
      email: "tliu172@ucr.edu",
      password: "mockHash",
    };
    jest.spyOn(console, "log");
    jest.spyOn(console, "error");
    jest.resetAllMocks();
  });

	// Test isValid: all fields are empty => throw error
  it("isValid: all fields empty throws error", async () => {
    const req = {
      body: {
        name: "",
        email: "",
        password: "",
      },
      flash: jest.fn(),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn(),
    };

    const error = new Error("Empty field submitted in sign up");

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("400 Bad Request");
    expect(console.error).toHaveBeenCalledWith("SIGNUP ERROR: " + error.message);
  });

  // Test isValid: empty "name" field submitted => throw error
  it("isValid: empty name field throws error", async () => {
    const req = {
      body: {
        name: "",
        email: "tliu172@ucr.edu",
        password: "pword13579!",
      },
      flash: jest.fn(),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn(),
    };
		
    const error = new Error("Empty field submitted in sign up");

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("400 Bad Request");
		expect(console.error).toHaveBeenCalledWith("SIGNUP ERROR: " + error.message);
  });

  // Test isValid: empty "email" field submitted => throw error
	it("isValid: empty email field throws error", async () => {
    const req = {
      body: {
        name: "Tian Liu",
        email: "",
        password: "pword13579!",
      },
      flash: jest.fn(),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn(),
    };
		
    const error = new Error("Empty field submitted in sign up");

		await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("400 Bad Request");
		expect(console.error).toHaveBeenCalledWith("SIGNUP ERROR: " + error.message);
  });

	// Test isValid: empty "password" field submitted => throw error
	it("isValid: empty password field throws error", async () => {
		const req = {
      body: {
        name: "Tian Liu",
        email: "tliu172@ucr.edu",
        password: "",
      },
      flash: jest.fn(),
    };
		const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn(),
    };
		
    const error = new Error("Empty field submitted in sign up");

		await signup(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith("400 Bad Request");
		expect(console.error).toHaveBeenCalledWith("SIGNUP ERROR: " + error.message);
	});

  // Test checkAvailableEmail: email submitted is already in use => redirect to sign up page
  it("checkAvailableEmail: submitting an email already in use redirects back to signup page", async () => {
    const req = {
      body: {
        name: "Tian Liu",
        email: "tliu172@ucr.edu", 
        password: "pword13579!",
      },
      flash: jest.fn(),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn(),
    };

    User.find.mockResolvedValueOnce([theUserCreated]);

    await signup(req, res);

    expect(User.find).toHaveBeenCalledWith({ email: req.body.email });
    expect(req.flash).toHaveBeenCalledWith("errorMessage", "Email in use already");
    expect(res.redirect).toHaveBeenCalledWith("/signup");
  });

  // Test signup: all fields submitted are valid => create new user
  it("signup: create new user when all fields are valid", async () => {
    const req = {
      body: {
        name: "Tian Liu",
        email: "tliu172@ucr.edu",
        password: "pword13579!",
      },
      flash: jest.fn(),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn(),
    };

    User.create.mockResolvedValueOnce(theUserCreated);
    User.find.mockResolvedValueOnce([]);
    bcrypt.genSalt = jest.fn().mockResolvedValue("mockSalt");
    bcrypt.hash = jest.fn().mockResolvedValue("mockHash");

    await signup(req, res);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, "mockSalt");
    expect(User.create).toHaveBeenCalledWith(theUserCreated);
    expect(console.log).toHaveBeenCalledWith("Signed up");
    expect(req.flash).toHaveBeenCalledWith("successMessage", "Please log in to confirm");
    expect(res.redirect).toHaveBeenCalledWith("/login");
    expect(console.error).not.toHaveBeenCalled();
  });
});

