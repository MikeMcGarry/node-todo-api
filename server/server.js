const express = require('express')
const bodyParser = require('body-parser')
const port = global.PORT | 3000

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')

var app = express()

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  console.log(req.body)
  var todo = new Todo({
    "text": req.body.text
  })
  todo.save().then((doc) => {
    console.log('Note saved')
    res.send(`Note Saved ${doc}`)
  }, (err) => {
    console.log('Error saving note')
    res.status(400).send(err)
  })

})

app.get('/todos', (req, res) => {
  console.log(req.url)
  Todo.find().then((doc) => {
    res.status(200).send({doc})
  }, (err) => {
    res.status(400).send(err)
  })
})

app.listen(port, () => {
  console.log(`started on port ${port}`)
})
