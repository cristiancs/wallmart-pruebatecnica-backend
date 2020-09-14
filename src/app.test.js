require("@babel/polyfill");

const request = require('supertest')
const app = require('./app')
describe('Post Endpoints', () => {
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