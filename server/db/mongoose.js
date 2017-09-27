const mongoose = require('mongoose')
mongoose.Promise = global.Promise

var url = 'mongodb://localhost:27017/node-todo-api'
mongoose.connect(url)

module.exports = {mongoose}
