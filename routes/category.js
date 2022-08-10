const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const usersController = require('../controllers/usersController');

router.post("/create/:userId",authController.requireSignIn,authController.isAuth,authController.isAdmin,categoryController.create);
router.put('/update/:userId/:categoryId',authController.requireSignIn,authController.isAuth,authController.isAdmin,categoryController.update);
router.delete("/delete/:userId/:categoryId",authController.requireSignIn,authController.isAuth,authController.isAdmin,categoryController.remove);
router.get('/all',categoryController.list);
router.get('/:categoryId',categoryController.read); // Put this at last due to router.param otherwise '/all' route doesn't work.


router.param("userId",usersController.userById);
router.param("categoryId",categoryController.categoryById);

module.exports = router;