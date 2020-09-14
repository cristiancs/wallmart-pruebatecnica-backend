require("dotenv").config();
const config = process.env;


import express from "express";
import bodyParser from "body-parser";
import isPalindrome from "./modules/isPalindrome";


// Por si el string incluye algo que se puea considerar regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); 
}


function allowCrossSite(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Every domain can access
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Accept, Cache-Control, hash, user"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PATCH, DELETE, OPTIONS, HEAD, PUT"
  ); // Which methods

  next();
}

function appWrapper(db) {


  const app = express();
  app.use(allowCrossSite);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));




  app.use("/search", async (req,res) => {
      const {term, page=0} = req.query;
      if(isNaN(page)) {
         return res
              .status(400)
              .json({ message: "Número de página invalido" });
      }
      if(!term){
          return res
              .status(400)
              .json({ message: "Debes indicar un termino de búsqueda" });
      }
      if(isNaN(term) && term.length <= 3 ) {
          return res
              .status(400)
              .json({ message: "El largo mínimo de búsqueda debe ser de 4 caracteres" });
      }

      let findTerm = { id : Number(term) }
      if(isNaN(term)) {
        findTerm = {
            $or : [
              {  brand :  new RegExp(escapeRegExp(term)) },
              {  description :  new RegExp(escapeRegExp(term)) }
            ]
        }
      }

      let query = await db
      .collection("products")
      .find(findTerm, {})
      .sort({ _id: 1 })
      .toArray();
      const total = query.length;
      const resultado = query.slice(Number(config.ITEMS_PER_PAGE) * Number(page), Number(config.ITEMS_PER_PAGE) * Number(page) + Number(config.ITEMS_PER_PAGE))

      

      return res
            .status(200)
            .json({ resultado, pages: Math.ceil(total / Number(config.ITEMS_PER_PAGE)), items: total, promoDiscount: isPalindrome(term) });
  });
  return app;
}


module.exports = appWrapper;