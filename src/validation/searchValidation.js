export default (req, res, next) => {
	const { term, page = 0 } = req.query;
	if (isNaN(page)) {
		res.statusCode = 400;
		return res.json({ message: "Número de página invalido" });
	}
	if (!term) {
		res.statusCode = 400;
		return res.json({ message: "Debes indicar un termino de búsqueda" });
	}
	if (isNaN(term) && term.length <= 3) {
		res.statusCode = 400;
		return res.json({
			message: "El largo mínimo de búsqueda debe ser de 4 caracteres",
		});
	}
	next();
};
