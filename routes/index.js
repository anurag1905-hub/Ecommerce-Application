const express = require('express');
const router = express.Router();

router.get('/',function(req,res){
    console.log(req.cookies);
    return res.end();
});

router.use('/auth',require('./auth'));
router.use('/users',require('./user'));
router.use('/category',require('./category'));
router.use('/product',require('./product'));

module.exports = router;