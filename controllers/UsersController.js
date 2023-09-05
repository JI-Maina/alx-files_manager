const sha1 = require('sha1');

const dbClient = require('../utils/db');

const postNew = async (req, res) => {
  // destructure email and password from the request
  const { email, password } = req.body;

  if (password) {
    if (email) {
      // get collection from client and search if user already eists
      const collection = await dbClient.usersCollection();
      const usedEmail = await collection.findOne({ email });

      if (!usedEmail) {
        // hash password usin sha1 module
        const hashedPwd = sha1(password);

        const newUser = {
          email,
          password: hashedPwd,
        };

        // insert into database
        const { ops } = await collection.insertOne(newUser);

        const response = ops[0];

        return res.status(201).json({
          id: response._id,
          email: response.email,
        }).end();
      }
      return res.status(400).json({ error: 'Already exist' }).end();
    }
    return res.status(400).json({ error: 'Missing email' }).end();
  }
  return res.status(400).json({ error: 'Missing password' }).end();
};

module.exports = { postNew };
