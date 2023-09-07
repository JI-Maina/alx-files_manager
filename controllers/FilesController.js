const dbClient = require('../utils/db')

/**
 * create a new file in db and disk
 */

// const postUpload = (req, res) => {
  // res.status(200).json(req.headers)
// }

const async postUpload = (req, res) => {
  const { userId } = await userUtils.getIdAndKey(req);
  
  if (!basicUtils.isValid(userId)) {
    return response.status(401).send({ error: 'Unauthorized' });
  }

  if (!userId && req.body.type == 'image') {
    await fileQueue.add({});
  }

  const user = await userUtils.getUser({
    _id: ObjectId(userId),
  });

  if (!user) return response.status(401).send({ error: 'Unauthorized' });

  const { error: validationError, fileParams } = await fileUtils.validateBody(req,);

  if (fileParams.parentId !== 0 && !basicUtils.isValidId(fileParams.parentId)) { return response.status(400).send({ error: 'Parent not found' }); }

  const { error, code, newFile } = await fileUtils.saveFile(
    userId,
    fileParams,
    FOLDER_PATH,
  );

  if (fileParams.type == 'image') {
    await fileQueue.add({
      fileId: newFile.id.toString(),
      userId: newFile.userId.toString(),
    });
  }

  return response.status(201).send(newFile);
};

const async getShow = (req, res) => {
  const fileId = req.params.id;

  cost { userId } = await userUtils.getUserIdAndKey(req);

  const user = await userUtils.getUser({
    _id: ObjectId(userId),
  });

  if (!user) return res.status(401).send({ error: 'Unauthorized' });
  
  //Mongo condition
  if (!basicUtils.isValidId(fileId) || !basicUtils.isValidID(userId)) { return res.status(404).send({ error: 'Not found' }); }

  const result = await fileUtils.getFile({
    _id: ObjectId(fileId),
    userId: ObjectId(userId),
  });

  if (!result) return res.status(404).send({ error: 'Not found' });

  const file = fileUtils.processFile(result);

  return res.status(200).send(file);
}

/**
 * should retrieve all users file documents for a specific
 * parentId and with pagination
 */
const async getIndex = (req, res) => {
  const { userId } = await userUtils.getUserIdAndKey(req);

  const user = await userUtils.getUser({
    _id: ObjectId(userId),
  });

  if (!user) return res.status(401).send({ error: 'Unauthorized' });

  let parentId = req.query.parentId || '0';

  if (parentId === '0') parentId = 0;

  let page = Number(req.query.page) || 0;

  if (Number.isNaN(page)) page = 0;

  if (parentId !== 0 && parentId !== '0') {
    if (!basicUtils.isValidId(parentId)) { return res.status(401).send({ error: 'Unauthorized' }); }

    parentId = ObjectId(parentId);

    const folder = await fileUtils.getFile({
      _id: ObjectId(parentId),
    });

    if (!folder || folder.type !== 'folder') { return response.status(200).send([]); }
  }

  const pipeline = [
    { $match: { parentId } },
    { $skip: page * 20 },
    {
      $limit: 20,
    },
  ];

  const fileCursor = await fileUtils.getFilesOfParentId(pipeline);

  const fileList = [];
  await fileCursor.forEach((doc) => {
    const document = fileUtils.processFile(doc);
    fileList.push(document);
  });

  return response.status(200).send(fileList);
}


module.exports = { postUpload }
