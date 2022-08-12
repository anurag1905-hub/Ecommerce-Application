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

module.exports.read = function(req,res){
    // hide the user's password and salt
    req.profile.hashed_password=undefined;
    req.profile.salt=undefined;
    return res.json(req.profile);
}

module.exports.update = function(req,res){
    User.findOneAndUpdate({_id:req.profile._id},{$set:req.body},{new:true},function(err,user){
        if(err){
            return res.status(400).json({
                error:"There was an error"
            });
        }
        else{
            // hide the user's password and salt
            user.hashed_password=undefined;
            user.salt=undefined;
            return res.json(user);
        }
    });
}