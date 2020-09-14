require("dotenv").config();
const config = process.env;

import http from "http";

import mongoHandler from "./modules/mongoHandler";

const app = require("./app");
const port = config.HTTP_PORT || 8080;

let db, server;

async function run() {
  try {
    db = await mongoHandler();
  } catch (error) {
    console.log(error);
    return;
  }
  server = http.createServer(app).listen(port, function () {
    console.log("HTTP Server Started",port);
  });
}

run();
