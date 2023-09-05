const express = require('express');

const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');

const router = express.Router();

// const controllerRouting = (app) => {
//  app.use('/', router);

// App Controller - return true if Redis and DB are alive
// route.get('/status', (req, res) => {
// AppController.getStatus(req, res);
// });

// return the no of users and files in DB
// route.get('/stats', (req, res) => {
// AppController.getStats(req, res);
// });
// }
router.get('/status', AppController.getStatus);

router.get('/stats', AppController.getStats);

router.post('/users', UsersController.postNew);

module.exports = router;
