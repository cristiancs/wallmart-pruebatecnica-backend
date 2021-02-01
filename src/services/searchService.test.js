import "regenerator-runtime/runtime";
import { MongoClient } from "mongodb";
import mongoHandler from "../modules/mongoHandler";
import searchService from "./searchService";

describe("Test searchService responses", () => {
	let db;
	let dbclient;
	let inserted;
	beforeAll(async () => {
		dbclient = await MongoClient.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
		});

		const toInsert = {
			id: 1,
			brand: "ooy eqrceli",
			description: "rlñlw brhrka",
			image: "www.lider.cl/catalogo/images/whiteLineIcon.svg",
			price: 498724,
		};
		db = dbclient.db("test");
		inserted = await db.collection("products").insertOne(toInsert);
		inserted = {
			_id: inserted.insertedId,
			...toInsert,
		};
	});
	afterAll(async () => {
		await dbclient.close();
	});
	it("Calls the DB to query the data", async () => {
		const spy = jest
			.spyOn(mongoHandler, "getDb")
			.mockImplementation(() => db);
		await searchService("1", 1);
		expect(spy).toHaveBeenCalled();
	});
	it("Returns the correct response format", async () => {
		jest.spyOn(mongoHandler, "getDb").mockImplementation(() => db);
		const response = await searchService("1", 0);
		expect(response).toMatchObject({
			results: [inserted],
			pages: 1,
			items: 1,
		});
	});
});
