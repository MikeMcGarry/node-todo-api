const mongodb = require('mongodb')
const assert = require('assert')

var mongoClient = mongodb.MongoClient()
var url = 'mongodb://localhost:27017/node-todo-api'

var insertDocuments = (db, callback) => {
  var collection = db.collection('Todos')
  collection.insertMany([
    {task: "Train legs & arms", completed: true},
    {task: "Learn nodejs", completed: false},
    {task: "Read for 30 minutes", completed: true}
  ], (err, result) => {
    assert.equal(err,null)
    assert.equal(3, result.result.n)
    assert.equal(3, result.ops.length)
    console.log(`Inserted 3 docs into Todos`)
    callback(result)
  })
}

mongoClient.connect(url, (err,db) => {
  assert.equal(null,err)
  console.log("Connected correctly")
  insertDocuments(db, (result) => {
    console.log(result)
  })
  db.close()
})
