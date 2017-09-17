const mongodb = require('mongodb')
const assert = require('assert')

var mongoClient = mongodb.MongoClient()
var url = 'mongodb://localhost:27017/mongo-data'

var insertDocuments = (db, callback) => {
  var collection = db.collection('Todos')
  collection.insertMany([
    {mynote: "hello this is my note"},
    {yournote: "no no this is your note"},
    {ournote: "this is our note baby"}
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
