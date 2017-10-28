const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const port = process.env.PORT || 3000

const {mongoose} = require('./db/mongoose')
const {ObjectID} = require('mongodb')
const {todo} = require('./models/todo')
const {user} = require('./models/user')

var app = express()

var validateId = function (id) {
  var valid = ObjectID.isValid(id)
  return valid
}

var invalidId = function (req, res, id) {
  res.status(404).send(`${id} is an invalid id`)
}

app.use(bodyParser.json())

//GET Find All Todos
app.get('/todos', (req, res) => {
  todo.find().then((doc) => {
    res.status(200).send({doc})
  }, (err) => {
    res.status(404).send(err)
  })
})

//GET Find Todo by ID
app.get('/todos/:id', (req, res) => {
  id = req.params.id
  if (!validateId(id)) {
    invalidId(req, res, id)
  }
  todo.findById(id).then((doc) => {
    res.status(200).send({doc})
  }, (err) => {
    res.status(404).send(err)
  })
})

//POST New Todo
app.post('/todos', (req, res) => {
  var body = _.pick(req.body, ['text'])
  if (body.text) {
    var newToDo = new todo({
      "text": body.text
    })
  } else {
    res.status(400).send("Please provide text to add to the todo list")
  }

  newToDo.save().then((doc) => {
    res.send(`Note Saved ${doc}`)
  }, (err) => {
    res.status(400).send(err)
  })
})

//POST New Users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])
  if (body.email && body.password) {
    var newUser = new user({
      "email": body.email,
      "password": body.password,
      "tokens": {access: 'desktop', token: 'abc56sdgss4'}
    })
  } else {
    res.status(400).send("Please provide an email and password")
  }

  newUser.save().then((doc) => {
    res.send(`New user created with ${doc}`)
  }, (err) => {
    res.status(400).send(err)
  })
})

//DELETE Todo by Id
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id
  if (!validateId(id)) {
    invalidId(req, res, id)
  }

  todo.findByIdAndRemove(req.params.id).then((doc) => {
    if (doc == null || doc.length == 0) {
      res.status(404).send(`Could not find doc with ${id}`)
    } else {
      res.status(200).send(`Sucesfully removed doc with ${id}`)
    }

  }, (err) => {
    res.status(404).send(`Error removing doc with ${id} due to ${err}`)
  })
})

//PATCH Update Todo
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id
  var body = _.pick(req.body, ['text', 'completed'])
  if (!id) {
    invalidId(req, res, id)
  }

  todo.findById(id).then((doc) => {
    if (body.completed && _.isBoolean(body.completed)) {
      doc.set({"completed": body.completed})
      var timeStamp = new Date().getTime()
      doc.set({"completedAt": timeStamp})
    }

    if (body.text && _.isString(body.text)) {
      doc.set({"text": body.text})
    }

    doc.save().then((doc) => {
      res.status(200).send(doc)
    })
  }).catch((err) => {
    res.status(400).send(err)
  })
})

app.listen(port, () => {
  console.log(`started on port ${port}`)
})
