const mongodb = require('mongodb')
const assert = require('assert')

var mongoClient = mongodb.MongoClient()
var ObjectID = mongodb.ObjectID
var url = 'mongodb://localhost:27017/node-todo-api'

var handler = (err, result) => {
  if (err) {
    console.log(`Unable to access ${collection} due to ${err}`)
  } else
  console.log(JSON.stringify(result, null, 2))
  }

var operation = (collection, operationFunc, callback, payload=false, url2=url) => {
  mongoClient.connect(url, (err,db) => {
    assert.equal(null,err)
    console.log("Connected correctly")
    operationFunc(db, collection, handler, payload)
    db.close()
  })}

var insertDocuments = (db, collection, callback, payload=false) => {
  var collection = db.collection(collection)
  collection.insertMany(payload, (err, result) => {
    noOps = payload.length
    assert.equal(err,null)
    assert.equal(noOps, result.result.n)
    assert.equal(noOps, result.ops.length)
    console.log(`Inserted ${noOps} docs into Todos`)
    callback(null, result)
  })
}

var deleteDocuments = (db, collection, callback, payload=false) => {
  var collection = db.collection(collection)
  var result = collection.findOneAndDelete({_id: new ObjectID(payload)}).then((result) => {
    callback(null, result)
  }, (err) => {
    callback(err)
  })
}

var findDocuments = (db, collection, callback, payload=false) => {
  var collection = db.collection(collection)
  var result = collection.find().toArray().then((docs) => {
    callback(null, docs)
  }, (err) => {
    callback(err)
  })
}

var updateDocuments = (db, collection, callback, payload=false) => {
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

operation("Todos", findDocuments, handler)
