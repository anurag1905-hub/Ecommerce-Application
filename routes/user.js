const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

router.get('/secret/:userId',authController.requireSignIn,authController.isAuth,authController.isAdmin,function(req,res){
    res.json({
        user:req.profile
    });
});

router.param('userId',usersController.userById);

module.exports = router;