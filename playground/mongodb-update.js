const mongodb = require('mongodb')
const assert = require('assert')

var mongoClient = mongodb.MongoClient()
var ObjectID = mongodb.ObjectID
var url = 'mongodb://localhost:27017/node-todo-api'


mongoClient.connect(url, (err,db) => {
  assert.equal(null,err)
  console.log("Connected correctly")
  updateDocuments(db, 'Todos', (err, result) => {
    if (err) {
      console.log(`unable to update ${collection} due to ${err}`)
    } else
    console.log(JSON.stringify(result, null, 2))
    })
  db.close()
})
