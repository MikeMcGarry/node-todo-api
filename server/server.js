const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

var {mongoose} = require('./db/mongoose')
var {ObjectID} = require('mongodb')
var {todo} = require('./models/todo')
var {user} = require('./models/user')

var app = express()

var validateId = function (id) {
  var valid = ObjectID.isValid(id)
  return valid
}

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  console.log(req.body)
  var newToDo = new todo({
    "text": req.body.text
  })
  newToDo.save().then((doc) => {
    console.log('Note saved')
    res.send(`Note Saved ${doc}`)
  }, (err) => {
    console.log('Error saving note')
    res.status(400).send(err)
  })

})

app.get('/todos/delete/:id', (req, res) => {
  console.log(req.body)
  var id = req.params.id
  if (id) {
    todo.findByIdAndRemove(req.params.id).then((doc) => {
      if (doc == null || doc.length == 0) {
        res.status(404).send(`Could not find doc with ${id}`)
      } else {
        res.status(200).send(`Sucesfully removed doc with ${id}`)
      }

    }, (err) => {
      res.status(404).send(`Error removing doc with ${id} due to ${err}`)
    })
  } else {
    res.status(404).send(`${id} is invalid`)
  }
})

app.get('/todos', (req, res) => {
  console.log(req.url)
  todo.find().then((doc) => {
    res.status(200).send({doc})
  }, (err) => {
    res.status(404).send(err)
  })
})

app.get('/todos/:id', (req, res) => {
  console.log(req.url)
  todo.findById(req.params.id).then((doc) => {
    res.status(200).send({doc})
  }, (err) => {
    res.status(404).send(err)
  })
})

app.listen(port, () => {
  console.log(`started on port ${port}`)
})
