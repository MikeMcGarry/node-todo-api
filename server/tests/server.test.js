const request = require('supertest')
const expect = require('expect')
const {app} = require('./../server')

var validID = '59c8d2127fc0f202a424a188'

it('should return ok status', (done) => {
  request(app)
    .get(`/todo/${validID}`)
    .expect(200)
    .expect('content-type', 'application/json; charset=utf-8')
    .expect((res) => {
      expect(res.body.doc).toHaveProperty('text')
    })
    .end(done)
})
