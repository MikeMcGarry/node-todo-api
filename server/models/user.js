const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

//Create the userSchema
var userSchema = new Schema({
  //email field
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
  //password field
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  //tokens list containing an access object
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

//Controls what information is available when a document
//is converted to JSON e.g. JSON.stringify
//This only allows 'email' and '_id' to be shown
//Note that without the stringify method the entire doc is returned
userSchema.methods.toJSON = function () {
  var user = this
  //Why do we need to convert to an Object?
  var userObject = user.toObject()
  var trimmedUserObject = _.pick(userObject, ['email', '_id'])
  return trimmedUserObject
}

//Adding an instance method which can be called on a user instance
userSchema.methods.generateAuthToken = function () {
  var user = this
  var access = 'auth'
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'secretsalt').toString()
  user.tokens.push({access, token})
  return user.save().then(() => {
    return token
  })
}

//Adding a static method
//This can be called on the user model
userSchema.statics.findByToken = function (token) {
  var user = this
  var decoded

  try {
    decoded = jwt.verify(token, 'secretsalt')
    console.log(decoded)
  } catch (e) {
    return Promise.reject(e)
  }

  return user.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

userSchema.pre('save', function (next) {
  var user = this

  if (!user.isModified('password')) {
    next()
  }

  bcrypt.genSalt(12, (err, salt) => {
    if (err) {
      console.log(err)
    } else {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          console.log(err)
        } else {
          user.password = hash
          next()
        }
      })
    }
  })
})

var user = mongoose.model('user', userSchema)

module.exports = {user}
