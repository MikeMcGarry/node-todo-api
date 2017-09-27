const mongoose = require('mongoose')

var user = mongoose.model('user', {
  email: {
    type: String,
    required: true,
    trim: true,
    match: /\w+\@\w+\.[\w\.]+/
  }
})

module.exports = {user}
