import searchService from "../services/searchService";
import searchValidation from "../validation/searchValidation";

export default async (req, res) => {
	const response = await searchService(req, res);

	return res.status(200).json(response);
};
