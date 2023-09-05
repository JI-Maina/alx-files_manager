const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');

const controllerRouting = (app) => {
  app.use('/', router);

  //App Controller - return true if Redis and DB are alive
  route.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  //return the no of users and files in DB
  route.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });
}

module.exports = controllerRouting;
