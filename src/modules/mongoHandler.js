require("dotenv").config();
import { MongoClient } from "mongodb";
let dbclient, db;


let config = process.env;

export default async function () {
  try {
    dbclient = await MongoClient.connect(config.MONGODB_URL, {
      useUnifiedTopology: true,
    });
    db = dbclient.db(config.MONGODB_DATABASE);
    return db;
  } catch (error) {
    console.log(error);
    throw error;
  }
}