require("@babel/polyfill");
import mongoHandler from "./modules/mongoHandler";

const request = require('supertest')
const appWrapper = require('./app')
describe('Search Endpoints sin BD', () => {
  const app = appWrapper(null);
  it('Avisar cuando no hay query params y retornar 400', async () => {
    const res = await request(app)
      .get('/search')
      .send()
    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({"message": "Debes indicar un termino de búsqueda"})
    
  })
  it('Avisar cuando query string no es id y length <=3', async () => {
    const res = await request(app)
      .get('/search?term=asd')
    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({"message": "El largo mínimo de búsqueda debe ser de 4 caracteres"})
    
  })
  
})
describe('Search Endpoints con BD', () => {
  let db, app;
   beforeAll(async () => {
    try {
      db = await mongoHandler();
    } catch (error) {
      console.log(error);
      return;
    }
    app = appWrapper(db);
  });
    

  it('Default page 0 ', async () => {
    const res = await request(app)
      .get('/search?term=rlñlw');
    const res2 = await request(app)
      .get('/search?term=rlñlw&page=0');
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(res2.body);
  })

  it('Búsqueda por id', async () => {
    const res = await request(app)
      .get('/search?term=1')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({"resultado":[{"_id":"5f5fbebcbe3f8ab5b297aa90","id":1,"brand":"ooy eqrceli","description":"rlñlw brhrka","image":"www.lider.cl/catalogo/images/whiteLineIcon.svg","price":498724}],"pages":1,"items":1,"promoDiscount":true})
    
  })

  it('Pagina 0 con rlñlw', async () => {
    const res = await request(app)
      .get('/search?term=rlñlw')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({"resultado":[{"_id":"5f5fbebcbe3f8ab5b297aa90","id":1,"brand":"ooy eqrceli","description":"rlñlw brhrka","image":"www.lider.cl/catalogo/images/whiteLineIcon.svg","price":498724},{"_id":"5f5fbebcbe3f8ab5b297ab2a","id":78,"brand":"giw knqhzñd","description":"rlñlw brhrka","image":"www.lider.cl/catalogo/images/bicycleIcon.svg","price":776201}],"pages":5,"items":10,"promoDiscount":false})
    
  })
  it('Pagina 4 con rlñlw', async () => {
    const res = await request(app)
      .get('/search?term=rlñlw&page=4')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({"resultado":[{"_id":"5f5fbebdbe3f8ab5b297bd94","id":2435,"brand":"cñu cawdahj","description":"rlñlw brhrka","image":"www.lider.cl/catalogo/images/bicycleIcon.svg","price":191411},{"_id":"5f5fbebdbe3f8ab5b297c1e0","id":2985,"brand":"qeiydij","description":"rlñlw brhrka","image":"www.lider.cl/catalogo/images/whiteLineIcon.svg","price":648933}],"pages":5,"items":10,"promoDiscount":false})
  })
  it('Pagina 5 con rlñlw', async () => {
    const res = await request(app)
      .get('/search?term=rlñlw&page=5')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({"resultado":[],"pages":5,"items":10,"promoDiscount":false})
  
  })

})