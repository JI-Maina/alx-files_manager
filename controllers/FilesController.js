const dbClient = require('../utils/db')

const postUpload = (req, res) => {
  res.status(200).json(req.headers)
}

module.exports = { postUpload }
