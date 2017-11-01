const bcrypt = require('bcryptjs')

var password = 'N0va1069'

bcrypt.genSalt(12, (err,salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash)
  })
})
