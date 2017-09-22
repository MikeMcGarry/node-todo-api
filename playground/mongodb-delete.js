const mongodb = require('mongodb')
const assert = require('assert')

var mongoClient = mongodb.MongoClient()
var ObjectID = mongodb.ObjectID
var url = 'mongodb://localhost:27017/node-todo-api'

var deleteDocuments = (db, collection, callback) => {
  var collection = db.collection(collection)
  var result = collection.findOneAndDelete({_id: new ObjectID('59c4d0ae62e9490712ab98cf')}).then((result) => {
    callback(null, result)
  }, (err) => {
    callback(err)
  })
}

mongoClient.connect(url, (err,db) => {
  assert.equal(null,err)
  console.log("Connected correctly")
  deleteDocuments(db, 'Todos', (err, result) => {
    if (err) {
      console.log(`unable to delete ${collection} due to ${err}`)
    } else
    console.log(JSON.stringify(result, null, 2))
    })
  db.close()
})
