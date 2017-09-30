const express = require('express')
const bodyParser = require('body-parser')
const port = global.PORT | 3000

var {mongoose} = require('./db/mongoose')
var {todo} = require('./models/todo')
var {user} = require('./models/user')
var {mongoByIdAndDelete} = require('./../playground/mongoose-queries')

var app = express()

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

app.post('/todos/delete', (req, res) => {
  console.log(req.body)
  mongoByIdAndDelete(todo, req.body.id)
})

app.get('/todos', (req, res) => {
  console.log(req.url)
  todo.find().then((doc) => {
    res.status(200).send({doc})
  }, (err) => {
    res.status(400).send(err)
  })
})

app.listen(port, () => {
  console.log(`started on port ${port}`)
})
