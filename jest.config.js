// Configure Jest to run tests in a JSDOM test environment
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./setupTests.js"],
};

