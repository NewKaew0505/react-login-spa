
const jwt = require('jsonwebtoken');

const authMiddleware = function (req, eres, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
            res.status(500).send({
                message:
                  err.message || "Some error occurred."
              });
        }
        req.user = user
        next()
      })
  }

module.exports = authMiddleware