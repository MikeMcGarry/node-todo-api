const mongodb = require('mongodb')
const assert = require('assert')

var mongoClient = mongodb.MongoClient()
var ObjectID = mongodb.ObjectID
var url = 'mongodb://localhost:27017/node-todo-api'

var updateDocuments = (db, collection, callback) => {
  var collection = db.collection(collection)
  var result = collection.findOneAndUpdate({
    _id: new ObjectID('59c4d0904f9251070473f29c')
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    callback(null, result)
  }, (err) => {
    callback(err)
  })
}

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
