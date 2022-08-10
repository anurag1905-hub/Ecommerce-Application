const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const usersController = require('../controllers/usersController');
const productController = require('../controllers/productsController');

router.post("/create/:userId",authController.requireSignIn,authController.isAuth,authController.isAdmin,productController.create);

router.param("userId",usersController.userById);

module.exports = router;