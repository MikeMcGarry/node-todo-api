const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')


var userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },

  password: {
    type: String,
    require: true,
    minlength: 6
  },

  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]

})

var user = mongoose.model('user', userSchema)

module.exports = {user}
