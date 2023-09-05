const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');

router.use((req, res, next) => {
  const path = 
