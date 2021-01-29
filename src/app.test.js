require("@babel/polyfill");
import mongoHandler from "./modules/mongoHandler";

const request = require("supertest");
const appWrapper = require("./app");
	let app;
describe("Test search endpoints", () => {
	
	beforeAll(async () => {
		try {
			await mongoHandler.connect();
		} catch (error) {
			console.log(error);
			return;
		}
		app = appWrapper();
	});
	afterAll( async () => {
		mongoHandler.close();
	});
	it("Searches without terms and gets a 400 error with a error message", async () => {
		const res = await request(app).get("/search").send();
		expect(res.statusCode).toEqual(400);
		expect(res.body).toEqual({
			message: "Debes indicar un termino de búsqueda",
		});
	});
	it("Seraches with a short string that is not an id and returns an 400 error with a message", async () => {
		const res = await request(app).get("/search?term=asd");
		expect(res.statusCode).toEqual(400);
		expect(res.body).toEqual({
			message: "El largo mínimo de búsqueda debe ser de 4 caracteres",
		});
	});

	it("Search with page 0 and without page numbers and receives the same result", async () => {
		const res = await request(app).get("/search?term=rlñlw");
		const res2 = await request(app).get("/search?term=rlñlw&page=0");
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual(res2.body);
	});

	it("Serach by id and receives the only item that matches", async () => {
		const res = await request(app).get("/search?term=1");
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual(
			{"results":[{"_id":"5f5fbebcbe3f8ab5b297aa90","id":1,"brand":"ooy eqrceli","description":"rlñlw brhrka","image":"www.lider.cl/catalogo/images/whiteLineIcon.svg","price":498724,"finalPrice":249362}],"pages":1,"items":1}
		);
	});

	it("Search term 'rlñlw' and receives all the results that match with the term ", async () => {
		const res = await request(app).get("/search?term=rlñlw");
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual(
			{"results":[{"_id":"5f5fbebcbe3f8ab5b297aa90","id":1,"brand":"ooy eqrceli","description":"rlñlw brhrka","image":"www.lider.cl/catalogo/images/whiteLineIcon.svg","price":498724,"finalPrice":498724},{"_id":"5f5fbebcbe3f8ab5b297ab2a","id":78,"brand":"giw knqhzñd","description":"rlñlw brhrka","image":"www.lider.cl/catalogo/images/bicycleIcon.svg","price":776201,"finalPrice":776201}],"pages":5,"items":10}
			);
	});
	it("Search with uppercase and lowercase, receives the same results ", async () => {
		const lowercaseSerach = await request(app).get("/search?term=rlñlw");
		expect(lowercaseSerach.statusCode).toEqual(200);
		const uppercaseSearch = await request(app).get("/search?term=rlÑlW");
		expect(uppercaseSearch.statusCode).toEqual(200);
		expect(lowercaseSerach.body).toEqual(uppercaseSearch.body);
	});
	it("Ask for the 5th page for the term 'rlñlw' and receives results", async () => {
		const res = await request(app).get("/search?term=rlñlw&page=4");
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual(
			{"results":[{"_id":"5f5fbebdbe3f8ab5b297bd94","id":2435,"brand":"cñu cawdahj","description":"rlñlw brhrka","image":"www.lider.cl/catalogo/images/bicycleIcon.svg","price":191411,"finalPrice":191411},{"_id":"5f5fbebdbe3f8ab5b297c1e0","id":2985,"brand":"qeiydij","description":"rlñlw brhrka","image":"www.lider.cl/catalogo/images/whiteLineIcon.svg","price":648933,"finalPrice":648933}],"pages":5,"items":10}
		);
	});

	it("Ask for the 6th page for the term 'rlñlw' and receives empty results", async () => {
		const res = await request(app).get("/search?term=rlñlw&page=5");
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({
			results: [],
			pages: 5,
			items: 10,
		});
	});
});
