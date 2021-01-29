require("dotenv").config();
const config = process.env;

import http from "http";

import mongoHandler from "./modules/mongoHandler";

const port = config.PORT || 8080;


const app = require("./app");
async function run() {
	try {
		await mongoHandler.connect();
	} catch (error) {
		console.log(error);
		return;
	}
	 http.createServer(app()).listen(port, function () {
		console.log("HTTP Server Started", port);
	});
}

run();
