import isPalindrome from "../helpers/isPalindrome";
import mongoHandler from "../modules/mongoHandler";
import escapeRegExp from "../helpers/escapeRegExp";

require("dotenv").config();

const config = process.env;

export default async (req, res) => {
	const db = mongoHandler.getDb();

	const { term, page = 0 } = req.query;
	let findTerm = { id: Number(term) };
	if (isNaN(term)) {
		findTerm = {
			$or: [
				{
					brand: new RegExp(escapeRegExp(term), "i"),
				},
				{
					description: new RegExp(escapeRegExp(term), "i"),
				},
			],
		};
	}
	const isSearchTermPalindrome = isPalindrome(term);

	const query = await db
		.collection("products")
		.find(findTerm, {})
		.sort({ _id: 1 })
		.toArray();

	query.map((el) => {
		el.finalPrice = isSearchTermPalindrome ? el.price / 2 : el.price;
	});

	const total = query.length;
	const results = query.slice(
		Number(config.ITEMS_PER_PAGE) * Number(page),
		Number(config.ITEMS_PER_PAGE) * Number(page) +
			Number(config.ITEMS_PER_PAGE)
	);
	return {
		results,
		pages: Math.ceil(total / Number(config.ITEMS_PER_PAGE)),
		items: total,
	};
};
