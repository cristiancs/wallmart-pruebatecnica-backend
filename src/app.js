import express from "express";
import bodyParser from "body-parser";
import search from "./routes/search";
import searchValidation from "./validation/searchValidation";

require("dotenv").config();

function allowCrossSite(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*"); // Every domain can access
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Accept, Cache-Control, hash, user"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"POST, GET, PATCH, DELETE, OPTIONS, HEAD, PUT"
	); // Which methods

	next();
}

function appWrapper() {
	const app = express();
	app.use(allowCrossSite);
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	app.use("/search", searchValidation, search);
	return app;
}

module.exports = appWrapper;
