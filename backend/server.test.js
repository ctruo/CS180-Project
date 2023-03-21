const app = require("./server");
const supertest = require("supertest");
const request = supertest(app);

//Response code = 200 is successful
it("home ('/') endpoint", async () => {
  const response = await request.get("/");

  expect(response.statusCode).toBe(200);
});

it("pet-search endpoint", async () => {
  const response = await request.get("/pet-search?type=dog&location=92521&page=1");

  expect(response.statusCode).toBe(200);
});

it("shelter-search endpoint", async () => {
  const response = await request.get("/shelter-search?location=92521");

  expect(response.statusCode).toBe(200);
});

it("favorites endpoint", async () => {
  const response = await request.get("/favorites");

  expect(response.statusCode).toBe(200);
});

it("login endpoint", async () => {
  const response = await request.get("/login");

  expect(response.statusCode).toBe(200);
});

it("sign-up endpoint", async () => {
  const response = await request.get("/signup");

  expect(response.statusCode).toBe(200);
});

//Response code = 404 is unsuccessful
it("nonexistent endpoint", async () => {
  const response = await request.get("/nonexistent");

  expect(response.statusCode).toBe(404);
});
