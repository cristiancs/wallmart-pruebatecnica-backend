import isPalindrome from "../helpers/isPalindrome";
import mongoHandler from "../modules/mongoHandler";
import escapeRegExp from "../helpers/escapeRegExp";
require("dotenv").config();
const config = process.env;

export default  async (req, res) => {
    const db = mongoHandler.getDb();
    const { term, page = 0 } = req.query;
    if (isNaN(page)) {
        return res
            .status(400)
            .json({ message: "Número de página invalido" });
    }
    if (!term) {
        return res
            .status(400)
            .json({ message: "Debes indicar un termino de búsqueda" });
    }
    if (isNaN(term) && term.length <= 3) {
        return res.status(400).json({
            message: "El largo mínimo de búsqueda debe ser de 4 caracteres",
        });
    }

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

    let query = await db
        .collection("products")
        .find(findTerm, {})
        .sort({ _id: 1 })
        .toArray();
    
    query.map(el => {
        el.finalPrice = isSearchTermPalindrome ? el.price / 2 : el.price
    });

    const total = query.length;
    const results = query.slice(
        Number(config.ITEMS_PER_PAGE) * Number(page),
        Number(config.ITEMS_PER_PAGE) * Number(page) +
            Number(config.ITEMS_PER_PAGE)
    );

    return res.status(200).json({
        results,
        pages: Math.ceil(total / Number(config.ITEMS_PER_PAGE)),
        items: total,
    });
}