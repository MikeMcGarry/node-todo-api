const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')


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

userSchema.methods.toJSON = function () {
  var user = this
  var userObject = user.toObject()
  var trimmedUserObject = _.pick(userObject, ['email', '_id'])
  return trimmedUserObject
}

userSchema.methods.generateAuthToken = function () {
  var user = this
  var access = 'auth'
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'secretsalt').toString()
  user.tokens.push({access, token})
  return user.save().then(() => {
    return token
  })
}

var user = mongoose.model('user', userSchema)

module.exports = {user}
