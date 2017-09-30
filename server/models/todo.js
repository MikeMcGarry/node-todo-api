const mongoose = require('mongoose')

var todo = mongoose.model('todo', {
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

module.exports = {todo}
