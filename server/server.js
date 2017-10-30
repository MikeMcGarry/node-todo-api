const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const shajs = require('sha.js')
const port = process.env.PORT || 3000

const {mongoose} = require('./db/mongoose')
const {ObjectID} = require('mongodb')
const {todo} = require('./models/todo')
const {user} = require('./models/user')
const {authorise} = require('./middleware/authorise')

var app = express()

//This function is used to validate the ID of a MongoDB document, returns boolean
var validateId = function (id) {
  var valid = ObjectID.isValid(id)
  return valid
}

//This function is called when an ID is invalid
var invalidId = function (req, res, id) {
  res.status(404).send(`${id} is an invalid id`)
}

//This is express middleware that allows us to easily work with the body of requests
app.use(bodyParser.json())

//GET Find All Todos
app.get('/todos', (req, res) => {
  //Find All ToDos
  todo.find().then((doc) => {
    //Return the documents as an object with an 'ok' status code
    res.status(200).send({doc})
  }, (err) => {
    //Return the error with a 'not found' status code
    res.status(404).send(err)
  })
})

//GET Find Todo by ID
app.get('/todos/:id', (req, res) => {
  //Pull ID from the URL paramaters
  id = req.params.id
  //Check if invalid
  if (!validateId(id)) {
    invalidId(req, res, id)
  }
  //If valid search for the document
  todo.findById(id).then((doc) => {
    //Return the document as an object with an 'ok' status code
    res.status(200).send({doc})
  }, (err) => {
    //Return the error with a 'not found' status code
    res.status(404).send(err)
  })
})

//POST New Todo
app.post('/todos', (req, res) => {
  //Pick off the 'text' field from the request body
  var body = _.pick(req.body, ['text'])
  //If there is no body return 'bad request' with prompt to add text
  if (!body.text) {
    res.status(400).send("Please provide text to add to the todo list")
  }

  //Create new todo using the todo mongoose model
  var newToDo = new todo({
    "text": body.text
  })

  //Save the newly creted todo
  newToDo.save().then((doc) => {
    //Return the document as an object with an 'ok' status code
    res.status(200).send(`Note Saved ${doc}`)
  }, (err) => {
    //Return the error with a 'bad request' status code
    res.status(400).send(err)
  })
})

//POST New Users
app.post('/users', (req, res) => {
  //Pick of the email and password properties from the body object
  var body = _.pick(req.body, ['email', 'password'])
  //If the email or password is missing return 'bad request'status code
  if (!body.email || !body.password) {
    res.status(400).send("Please provide an email and/or password")
  }
  //Create a new user with the email and password, hashing the password
  var newUser = new user({
    "email": body.email,
    "password": shajs('sha256').update(body.password).digest('hex')
  })
  //Save the new user and generate an authentication token passing it back through the header
  newUser.save().then(() => {
    //Generate authentication token using instance method on the user model
    return newUser.generateAuthToken()
  }).then((token) => {
    //Return the token via the header
    //Return new user information via the body
    res.header('x-auth', token).send(JSON.stringify(newUser, undefined, 2))
  }).catch((err) => {
    //Return 'bad request' status code with associated error
    res.status(400).send(err)
  })
})

//GET All Users
app.get('/users', (req, res) => {
  //Find all users
  user.find().then((doc) => {
    //Return all users with 'ok' status code
    res.status(200).send({doc})
  }, (err) => {
    //Return 'not found' status code with associated error
    res.status(404).send(err)
  })
})

//DELETE Todo by Id
app.delete('/todos/:id', (req, res) => {
  //Pick id off the url paramaters
  var id = req.params.id
  //Check if the id is invalid
  if (!validateId(id)) {
    invalidId(req, res, id)
  }
  //Find and remove the document by ID
  todo.findByIdAndRemove(id).then((doc) => {
    //If there is no document return 'not found' status code
    if (doc == null || doc.length == 0) {
      res.status(404).send(`Could not find doc with ${id}`)
    } else {
      //Else return 'ok' status with success message
      res.status(200).send(`Sucesfully removed doc with ${id}`)
    }

  }, (err) => {
    //Return 'not found' status code with associated error during findByIdAndRemove process
    res.status(404).send(`Error removing doc with ${id} due to ${err}`)
  })
})

//PATCH Update Todo
app.patch('/todos/:id', (req, res) => {
  //Pick up the id from the URL paramaters
  var id = req.params.id
  //Pick off the "text" and "completed" properties from the body
  var body = _.pick(req.body, ['text', 'completed'])
  //Check for invalid ID
  if (!id) {
    invalidId(req, res, id)
  }
  //Find todo by ID
  todo.findById(id).then((doc) => {
    //If body.completed is true set the document to completed and add the current time stamp
    if (body.completed && _.isBoolean(body.completed)) {
      doc.set({"completed": body.completed})
      var timeStamp = new Date().getTime()
      doc.set({"completedAt": timeStamp})
    }

    //If body.text is a string set the document text to body.text
    if (body.text && _.isString(body.text)) {
      doc.set({"text": body.text})
    }

    //Save the new document
    doc.save().then((doc) => {
      //Return 'ok' status code with document
      res.status(200).send(doc)
    })
  }).catch((err) => {
    //Return 'bad request' status code with associated error
    res.status(400).send(err)
  })
})

//GET user information using authorise middleware to check the header token
app.get('/users/me', authorise, (req, res) => {
  res.status(200).send(JSON.stringify(req.user, undefined, 2))
})

//Start the server
app.listen(port, () => {
  console.log(`started on port ${port}`)
})
