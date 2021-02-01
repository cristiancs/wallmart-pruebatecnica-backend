import "regenerator-runtime/runtime";

import searchValidation from "./searchValidation";

describe("Validate search input", () => {
	const NextFunction = jest.fn();
	let mockResponse;
	beforeEach(() => {
		mockResponse = {
			json: jest.fn(),
		};
	});
	it("Searches  with valid term and request passes", async () => {
		const req = {
			query: {
				term: "1",
			},
		};
		searchValidation(req, mockResponse, NextFunction);

		expect(NextFunction).toBeCalledTimes(1);
	});

	it("Searches without terms and gets a 400 error with a error message", async () => {
		const req = {
			query: {},
		};

		searchValidation(req, mockResponse, NextFunction);

		expect(mockResponse.statusCode).toBe(400);
		expect(mockResponse.json).toBeCalledWith({
			message: "Debes indicar un termino de búsqueda",
		});
	});

	it("Searches with a short string that is not an id and returns an 400 error with a message", async () => {
		const req = {
			query: {
				term: "asd",
			},
		};

		searchValidation(req, mockResponse, NextFunction);

		expect(mockResponse.statusCode).toBe(400);
		expect(mockResponse.json).toBeCalledWith({
			message: "El largo mínimo de búsqueda debe ser de 4 caracteres",
		});
	});
	it("Searches with a non numeric page number and returns an 400 error with a message", async () => {
		const req = {
			query: {
				term: "1",
				page: "invalid page",
			},
		};

		searchValidation(req, mockResponse, NextFunction);

		expect(mockResponse.statusCode).toBe(400);
		expect(mockResponse.json).toBeCalledWith({
			message: "Número de página invalido",
		});
	});
});
