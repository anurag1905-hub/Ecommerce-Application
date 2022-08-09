const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const validateData = require('../validator');

router.post('/signup',validateData.userSignupValidator,authController.signup);
router.post('/signin',authController.signin);
router.get('/signout',authController.signout);

router.get('/hello',authController.requireSignIn,function(req,res){
    res.send("Hello there");
});

module.exports = router;