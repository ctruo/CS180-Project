process.env.NODE_ENV = "test";

const utils = require("util");
global.TextEncoder = utils.TextEncoder;
global.TextDecoder = utils.TextDecoder;

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
const { window } = jsdom;
global.window = window;
global.document = window.document;

Object.keys(window).forEach((property) => {
  if (typeof global[property] === "undefined") {
    global[property] = window[property];
  }
});

Object.defineProperty(global.window, "location", {
  value: {
    pathname: "mockPath"
  },
  writable: true
});

global.navigator = {
  userAgent: "node.js"
};

