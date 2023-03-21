const bcrypt = require("bcrypt");
const User = require("./Users");
const login = require("./login");

jest.mock("./Users");

describe("login", () => {
	theUserFound = {
		firstName: "Tian",
		lastName: "Liu",
		email: "tliu172@ucr.edu",
	};
	
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

	// Test isValidRequest: all fields are empty => throw error
  it("isValidRequest: all fields empty throws error", async () => {
    const req = {
      body: {
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

    const error = new Error("Empty field submitted in login");

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("400 Bad Request");
    expect(console.error).toHaveBeenCalledWith("LOGIN ERROR: " + error.message);
  });

	// Test isValidRequest: empty "email" field submitted => throw error
	it("isValidRequest: empty email field throws error", async () => {
		const req = {
			body: {
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

		const error = new Error("Empty field submitted in login");

		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith("400 Bad Request");
		expect(console.error).toHaveBeenCalledWith("LOGIN ERROR: " + error.message);
	});

	// Test isValidRequest: empty "password" field submitted => throw error
	it("isValidRequest: empty password field throws error", async () => {
    const req = {
      body: {
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

    const error = new Error("Empty field submitted in login");

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("400 Bad Request");
    expect(console.error).toHaveBeenCalledWith("LOGIN ERROR: " + error.message);
  });

	// Test validateUser: email does not exist => flash no user found message and redirect back to login
	it("validateUser: flash no user found message and redirect back when email does not exist", async () => {
		const req = {
			body: {
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

		User.find.mockResolvedValueOnce([]);

		await login(req, res);

		expect(User.find).toHaveBeenCalledWith({ email: req.body.email });
    expect(req.flash).toHaveBeenCalledWith("errorMessage", "No user with that email found");
    expect(res.redirect).toHaveBeenCalledWith("/login");
	});

	// Test validateUser: email exists but password incorrect => flash incorrect password message and redirect back to login
	it("validateUser: flash incorrect password message and redirect back when password is incorrect", async () => {
		const req = {
			body: {
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

		User.find.mockResolvedValueOnce([theUserFound]);
		bcrypt.compare = jest.fn().mockResolvedValueOnce(false);

		await login(req, res);

		expect(User.find).toHaveBeenCalledWith({ email: req.body.email });
		expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, theUserFound.password);
		expect(req.flash).toHaveBeenCalledWith("errorMessage", "Incorrect password");
		expect(res.redirect).toHaveBeenCalledWith("/login");
	});

	// Test login: all fields submitted are valid => return user found
	it("login: user found and returned when all fields are valid", async () => {
		const req = {
			body: {
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

		User.find.mockResolvedValueOnce([theUserFound]);
		bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

		expect(await login(req, res)).toStrictEqual(theUserFound);
		expect(console.log).toHaveBeenCalledWith("Logged in");
    expect(console.error).not.toHaveBeenCalled();
	});
});
