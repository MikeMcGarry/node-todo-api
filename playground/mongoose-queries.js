var {mongoose} = require('./../server/db/mongoose')
var {Todo} = require('./../server/models/todo')

var id = '59cdeabc9209fc02f85ec77e'

var note = Todo.find({'_id':id}).then((doc) => {
  console.log(doc)
}, (err) => {
  console.log(err)
})
