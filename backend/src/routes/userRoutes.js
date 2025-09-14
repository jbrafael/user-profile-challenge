const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//  GET Route
router.get('/user', userController.getUser);

//  POST Route
router.post('/user', userController.saveUser);

module.exports = router;