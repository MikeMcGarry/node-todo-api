const {user} = require('./../models/user')

var authorise = function (req, res, next) {

  var token = req.header('x-auth')

  user.findByToken(token).then((user) => {
    if (!user) {
      res.status(401).send('User not found')
    }

    req.token = token
    req.user = user
    next()

  }, (err) => {
    res.status(401).send(err)
  })
}

module.exports = {authorise}
