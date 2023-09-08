const dbClient = require('../utils/db')
const redisClient = require('../utils/redis')

/**
 * create a new file in db and disk
 */

const postUpload = async (req, res) => {
  const token = req.headers['x-token'];
  const key = `auth_${token}`;
  const userObj = await redisClient.get(key);

  if (userObj) {
    const { name, type, parentId, isPublic, data } = req.body;

    const collection = await dbClient.filesCollection();
    
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !type.includes('folder', 'file', 'image')) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (!data && type != 'folder') {
      return res.status(400).json({ error: 'Missing data' });
    }
    if (parentId) {
      const file = await collection.findOne({parentId});

      if (file && file.type != 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
      return res.status(400).json({ error: 'Parent not found' });
    }
    
    if (type === 'folder') {
      
    }
    res.status(200).json({ name, type, parentId, isPublic, data })
    
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

/**
 * should retrieve the file document based on the ID
 */

const getShow = async (req, res) => {
  const token = req.headers['x-token'];
  const key = `auth_${token}`;
  const userObj = await redisClient.get(key);

  if (!userObj) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const fileId = req.params.id;

  const collection = await dbClient.filesCollection();
  const file = await collection.findOne({
    _id: ObjectId(fileId),
    userId: userObj.id,
  });

  if (!file) {
    return res.status(404).json({ error: 'Not found' });
  }

  return res.status(200).json(file);
};


/**
 * retrieve a list of file documents with pagination
 */

const getIndex = async (req, res) => {
  const token = req.headers['x-token'];
  const key = `auth_${token}`;
  const userObj = await redisClient.get(key);

  if (!userObj) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const parentId = req.query.parentId || 0;
  const page = parseInt(req.query.page) || 0;
  const perPage = 20; // Items per page

  const collection = await dbClient.filesCollection();

  const pipeline = [
    {
      $match: {
        userId: userObj.id,
        parentId: ObjectId(parentId),
      },
    },
    {
      $skip: page * perPage,
    },
    {
      $limit: perPage,
    },
  ];

  const files = await collection.aggregate(pipeline).toArray();

  return res.status(200).json(files);
};

module.exports = {
  postUpload,
  getShow,
  getIndex,
}

