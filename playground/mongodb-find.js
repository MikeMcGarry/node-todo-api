const mongodb = require('mongodb')
const assert = require('assert')

var mongoClient = mongodb.MongoClient()
var url = 'mongodb://localhost:27017/node-todo-api'

var findDocuments = (db, collection, callback) => {
  var collection = db.collection(collection)
  var result = collection.find().toArray().then((docs) => {
    callback(null, docs)
  }, (err) => {
    callback(err)
  })
}

mongoClient.connect(url, (err,db) => {
  assert.equal(null,err)
  console.log("Connected correctly")
  findDocuments(db, 'Todos', (err, result) => {
    if (err) {
      console.log(`unable to fetch ${collection} due to ${err}`)
    } else
    console.log(JSON.stringify(result, null, 2))
    })
  db.close()
})
