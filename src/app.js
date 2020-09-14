import express from "express";
import bodyParser from "body-parser";


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


const app = express();
app.use(allowCrossSite);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/search", (req,res) => {
    const {term} = req.query;

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
    

    return res
          .status(400)
          .json({ message: "Hola" });
});

module.exports = app;