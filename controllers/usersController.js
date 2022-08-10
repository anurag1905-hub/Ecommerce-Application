const User = require('../models/user');

module.exports.userById = function(req,res,next,id){
    console.log(id);
    User.findById(id,function(err,user){
        if(err||!user){
            return res.status(400).json({
                error:"User not found"
            });
        }
        else{
            req.profile = user;
            next();
        }
    });
}