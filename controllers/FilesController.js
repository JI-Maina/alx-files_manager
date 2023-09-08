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

module.exports = {
  postUpload,
}

