const request = require('supertest')
const expect = require('expect')
const {app} = require('./../server')
const {todo} = require('./../models/todo')

var docIds = {
  validID:'59d0357eb2a16e04dcf424b1',
  validNoDocID:'59d0357eb2a16e04dcf424ba',
  invalidID:'6e04dcf42'
}

var testDoc = {
  _id: docIds.validID,
  "text": "Hang out the washing"
}

//Remove all notes then add in one note
beforeEach((done) => {
  todo.remove({}).then(() => {
    var testNote = new todo(testDoc)
    return testNote.save(testNote)
  }).then(() => {
    done()
  })
})

//Testing ToDos
describe('Todo', () => {
  //Testing GET Requests
  describe('GET', () => {
    //Testing on /todo/:id
    describe('/todo/:id', () => {

      it('Testing with valid id and document found - It should return "ok" status and the todo document', (done) => {
        request(app)
          .get(`/todo/${docIds.validID}`)
          .expect(200)
          .expect('content-type', 'application/json; charset=utf-8')
          .expect((res) => {
              expect(res.body.doc).toHaveProperty('text')
          })
          .end(done)
      })

      it('Testing with valid id and no document found - It should return "ok" status and the todo document', (done) => {
        request(app)
          .get(`/todo/${docIds.validNoDocID}`)
          .expect(404)
          .expect(`Note with id ${docIds.validNoDocID} does not exist`)
          .end(done)
      })

      it('Testing with invalid id - It should return "bad request" status and an invalid id error', (done) => {
        request(app)
          .get(`/todo/${docIds.invalidID}`)
          .expect(400)
          .expect(`${docIds.invalidID} is an invalid id`)
          .end(done)
      })

      it('Testing with no id - It should return "bad request" status and an invalid id error', (done) => {
        request(app)
          .get(`/todo/${null}`)
          .expect(400)
          .expect(`${null} is an invalid id`)
          .end(done)
      })

    })

    describe('/todos', () => {

      it('Testing with todos available', (done) => {
        request(app)
          .get(`/todos`)
          .expect(200)
          // .expect((res) => {
          //   expect(res.body.doc).toHaveProperty('text')
          .end(done)
      })


      it('Testing with no todos available', (done) => {
        todo.remove({}).then(() => {
          request(app)
            .get(`/todos`)
            .expect(404)
            .end(done)
          })
      })
    })
  })


  describe('POST', () => {
    //Testing on the POST /todo/
    describe('/todo', () => {

      it('Testing with no body - It should return a "bad request" and error message', (done) => {
        request(app)
          .post('/todo')
          .set('Content-Type', 'application/json')
          .send({})
          .expect(400)
          .expect((res) => {
            expect(res.text).toContain("Please provide text to add to the todo list")
          })
          .end(done)
      })

      it('Testing with body & note saved - It should return an "ok" status and return saved note', (done) => {
        request(app)
          .post('/todo')
          .set('Content-Type', 'application/json')
          .send({'text': 'my new note'})
          .expect(200)
          .expect((res) => {
            expect(res.text).toContain('Note Saved')
          })
          .end(done)
      })

      // it('Testing with body & error saving note - It should return a "bad request" and error message', (done) => {
      //
      // })

    })
  })

  describe('Patch', () => {

    describe('/todo/:id', () => {

      it('Testing with invalid id - It should return "bad request" status and an invalid id error', (done) => {
        request(app)
          .patch(`/todo/${docIds.invalidID}`)
          .expect(400)
          .expect(`${docIds.invalidID} is an invalid id`)
          .end(done)
      })

    })
  })


})
