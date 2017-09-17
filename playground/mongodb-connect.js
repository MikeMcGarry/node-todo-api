const mongodb = require('mongodb')
const assert = require('assert')

var mongoClient = mongodb.MongoClient()
var url = 'mongodb://localhost:27017/mongo-data'
mongoClient.connect(url, (err,db) => {
  assert.equal(null,err)
  console.log("Connected correctly")
  db.close()
})
