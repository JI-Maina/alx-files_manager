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

module.exports = { postUpload }
