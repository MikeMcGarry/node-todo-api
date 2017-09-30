var {mongoose} = require('./../server/db/mongoose')
var {todo} = require('./../server/models/todo')
var {user} = require('./../server/models/user')
const {ObjectID} = require('mongodb')

var id = '59c602b067d8b20566fb7758'

//This validates the object id returning true or false
var validateId = function (id) {
  var valid = ObjectID.isValid(id)
  return valid
}

/**This shiows how to respond to a document being found and handles the case of an empty
document being returned **/
var docFound = function (doc) {
  if (doc == null || doc.length == 0)  {
    console.log(`Document could not be found`)
  } else {
    console.log('Found', JSON.stringify(doc, undefined, 2))
    return doc
  }
}

//This handles no document being found
var noDocFound = function (err) {
  console.log(`Document could not be found due to ${err}`)
}

//Finding all documents by a key, value pair
var mongoFind = function (model, finder) {
  var valid = validateId(id)
  if (valid) {
    model.find(finder).then((doc) => docFound(doc), (err) => noDocFound(err))
  } else {
    console.log(`Id ${id} is not valid`)
  }
}

//Finding one document
var mongoFindOne = function(model, finder) {
  var valid = validateId(id)
  if (valid) {
    model.findOne(finder).then((doc) => docFound(doc), (err) => noDocFound(err))
  } else {
    console.log(`Id ${id} is not valid`)
  }
}

//Finding one document by id
var mongoFindById = function(model, id) {
  var valid = validateId(id)
  if (valid) {
    model.findById(id).then((doc) => docFound(doc), (err) => noDocFound(err))
  } else {
    console.log(`Id ${id} is not valid`)
  }
}

var myUser = mongoFindById(user, id)
