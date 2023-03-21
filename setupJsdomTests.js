require("dotenv").config();

if (process.env.NODE_ENV !== "test") {
  process.env.BACKUP_NODE_ENV = process.env.NODE_ENV;
  process.env.NODE_ENV = "test";
}

const utils = require("util");
global.TextEncoder = utils.TextEncoder;
global.TextDecoder = utils.TextDecoder;

const { JSDOM } = require("jsdom");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

function createJSDOM(ejsFile, data) {
  let fileHTML = "<!DOCTYPE html><html><body></body></html>";

  if (ejsFile) {
    const filePath = path.join(__dirname, `./frontend/views/${ejsFile}`);
    const fileTemp = fs.readFileSync(filePath, "utf-8");
    fileHTML = ejs.render(fileTemp, data);
  }

  const dom = new JSDOM(fileHTML);
  global.window = dom.window;
  global.document = dom.window.document;
  global.document.body.innerHTML = fileHTML;
  
  Object.defineProperty(global.window, "location", {
    value: { pathname: dom.window.location.pathname },
    writable: true
  })
  
  Object.keys(dom.window).forEach((property) => {
    if (typeof global[property] === "undefined") {
      global[property] = dom.window[property];
    }
  });

  return fileHTML;
}

global.createJSDOM = createJSDOM;

