const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');
const validateData = require('../validator');

router.post('/signup',validateData.userSignupValidator,usersController.signup);
router.post('/signin',usersController.signin);
router.get('/signout',usersController.signout);

module.exports = router;