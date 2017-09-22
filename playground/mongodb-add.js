const mongodb = require('mongodb')
const assert = require('assert')

var mongoClient = mongodb.MongoClient()
var url = 'mongodb://localhost:27017/node-todo-api'

var insertDocuments = (db, collection, callback) => {
  var collection = db.collection(collection)
  collection.insertMany([
    {task: "Train legs & arms", completed: true},
    {task: "Learn nodejs", completed: false},
    {task: "Read for 30 minutes", completed: true}
  ], (err, result) => {
    assert.equal(err,null)
    assert.equal(3, result.result.n)
    assert.equal(3, result.ops.length)
    console.log(`Inserted 3 docs into Todos`)
    callback(null, result)
  })
}

mongoClient.connect(url, (err,db) => {
  assert.equal(null,err)
  console.log("Connected correctly")
  insertDocuments(db, "Todos", (err, result) => {
    if (err) {
      console.log(`error adding documents due to ${err}`)
    } else {
      console,log(JSON.stringify(result, null, 2)
    }
  })
  db.close()
})
