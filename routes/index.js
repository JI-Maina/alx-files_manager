const express = require('express');

const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const FilesController = require('../controllers/FilesController');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

router.get('/status', AppController.getStatus);

router.get('/stats', AppController.getStats);

router.post('/users', UsersController.postNew);

router.post('/files', FilesController.postUpload);

router.get('/connect', AuthController.getConnect);

router.get('/disconnect', AuthController.getDisconnect);

router.get('/users/me', UsersController.getMe);

router.get('/files', FilesController.getIndex);

router.get('/files:id', FilesController.getShow);

module.exports = router;
