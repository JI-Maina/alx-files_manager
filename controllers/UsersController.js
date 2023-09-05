const dbClient = require('../utils/db');

const postNew = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email) res.status(400).json({ 'error': 'Missing email' });
  if (!password) res.status(400).json({'error': 'Missing password' });

  // if email in db res.status(400).send('Already exist');

  res.status(201).json({ email });
}

module.exports = { postNew };
