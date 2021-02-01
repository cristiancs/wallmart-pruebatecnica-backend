import searchService from "../services/searchService";

export default async (req, res) => {
	const { term, page = 0 } = req.query;
	const response = await searchService(term, page);

	return res.status(200).json(response);
};
