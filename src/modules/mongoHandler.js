import { MongoClient } from "mongodb";

require("dotenv").config();

let dbclient;
let db;

const config = process.env;

export default {
	async connect() {
		try {
			dbclient = await MongoClient.connect(config.MONGODB_URL, {
				useUnifiedTopology: true,
			});
			db = dbclient.db(config.MONGODB_DATABASE);
			console.log("Connected to MongoDb");
			return db;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},
	async close() {
		await dbclient.close();
	},

	getDb() {
		return db;
	},
};
