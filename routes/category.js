const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const usersController = require('../controllers/usersController');

router.post("/create/:userId",authController.requireSignIn,authController.isAuth,authController.isAdmin,categoryController.create);

router.param("userId",usersController.userById);

module.exports = router;