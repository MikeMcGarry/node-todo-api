const mongodb = require('mongodb')
const assert = require('assert')

var mongoClient = mongodb.MongoClient()
var url = 'mongodb://localhost:27017/node-todo-api'



myNotes = [
  {"Task": "Train back", "Completed": false},
  {"Task": "Train arms", "Completed": true}
]

collection = "Todos"

mongoClient.connect(url, (err,db) => {
  assert.equal(null,err)
  console.log("Connected correctly")
  insertDocuments(db, collection, myNotes, (err, result) => {
    if (err) {
      console.log(`error adding documents due to ${err}`)
    } else {
      console.log(JSON.stringify(result, null, 2))
    }
  })
  db.close()
})
