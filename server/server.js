const express = require('express')
var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')

var app = express()

app.post('/', (req, res) => {
  console.log(req)
  res.send("heyyyyyyy")
})

app.listen(3000)
