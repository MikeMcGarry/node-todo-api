const mongoose = require('mongoose')
mongoose.Promise = global.Promise

var url = 'mongodb://localhost:27017/node-todo-api'
mongoose.connect(url)

var run = mongoose.model('run', {
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  completedAt: {
    type: Number
  }
})

var groceries = new run({text: "buy groceries", completedAt: 7898})

// groceries.save().then((doc) => {
//   console.log(`Saved ${doc}`)
// }, (err) => {
//   console.log(`${err}`)
// })

var user = mongoose.model('user', {
  email: {
    type: String,
    required: true,
    trim: true,
    match: /\w+\@\w+\.[\w\.]+/
  }
})

var mike = new user({email: "@"})

mike.save().then((doc) => {
  console.log(`Saved ${doc}`)
}, (err) => {
  console.log(`Your email address is invalid, please try again`)
})
