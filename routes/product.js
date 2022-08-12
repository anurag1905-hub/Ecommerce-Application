const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const usersController = require('../controllers/usersController');
const productController = require('../controllers/productsController');

router.post("/create/:userId",authController.requireSignIn,authController.isAuth,authController.isAdmin,productController.create);
router.get('/read/:productId',productController.read);
router.delete('/delete/:userId/:productId',authController.requireSignIn,authController.isAuth,authController.isAdmin,productController.remove);
router.put('/update/:userId/:productId',authController.requireSignIn,authController.isAuth,authController.isAdmin,productController.update);
router.get('/list',productController.list);
router.get('/related/:productId',productController.relatedProducts);

router.param("userId",usersController.userById);
router.param("productId",productController.productById);

module.exports = router;