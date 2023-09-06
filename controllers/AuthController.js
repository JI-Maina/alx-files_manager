const { v4: uuidv4 } = require('uuid');

const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const duration = 24 * 60 * 60;

const getConnect = async (req, res) => {
  // get authorization string from headers
  const auth = req.headers.authorization;
  const basic = auth.split(' ')[1];

  // decode base64 string to get user's email
  const emailPwd = Buffer.from(basic, 'base64').toString('utf-8');
  const email = emailPwd.split(':')[0];

  // get collection and find user
  const collection = await dbClient.usersCollection();
  const user = await collection.findOne({ email });

  if (user) {
    const token = uuidv4();

    const key = `auth_${token}`;
    const value = { id: user._id, email };

    // store user details in redis
    await redisClient.set(key, JSON.stringify(value), duration);

    return res.status(200).json({ token }).end();
  }

  return res.status(401).json({ error: 'Unauthorized' }).end();
};

const getDisconnect = async (req, res) => {
  const token = req.headers['x-token'];
  const key = `auth_${token}`;

  const user = await redisClient.get(key);
  console.log(token);
  console.log(key);
  console.log(user);
  if (user) {
    await redisClient.del(key);
    return res.status(204).end();
  }

  return res.status(401).json({ error: 'Unauthorized' });
};

module.exports = {
  getConnect,
  getDisconnect,
};
