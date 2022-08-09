const User = require('../models/user');
const handleError = require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken');  // to generate signed token.
const expressJWT = require('express-jwt'); // for authorization check

module.exports.signup = function(req,res){
    //console.log('req.body = ',req.body);
    User.create(req.body,function(err,user){
        if(err){
            return res.status(400).json({
                err:handleError.errorHandler(err),
                message:"Can't Sign up User"
            });
        }
        else{
            //Hide the salt and hashed_password
            user.salt=undefined;
            user.hashed_password=undefined;
            return res.json({
                user:user,
                message:"User Signed Up Successfully"
            });
        }
    });
}

module.exports.signin = function(req,res){
    console.log(req.body);
    User.findOne({email:req.body.email},function(err,user){
        if(err||!user){
            return res.status(400).json({
                error:"User with that email does not exist.Please Signup"
            });
        }
        else{
            // if user is found make sure the passwords match.
            // create authenticate method in user model.

            if(req.body.password==""||!user.authenticate(req.body.password)){
                return res.status(401).json({
                    error:"password dont match"
                })
            }

            //generate a signed token with user id and secret.
            const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
            // store the token as 't' in cookie with expiry date.
            res.cookie('t',token,{expire:new Date()+99999999});
            //return response with user and token to frontend client.
            const {_id,name,email,role} = user; //Destructring the object
            return res.json({token,user:{_id,email,name,role}});
        }
    });
}

module.exports.signout = function(req,res){
    res.clearCookie('t');
    return res.json({message:"Signed Out Successfully"});
}

module.exports.requireSignIn = expressJWT.expressjwt({
    secret:process.env.JWT_SECRET,
    algorithms:["HS256"],
    userProperty:"auth"
});

module.exports.isAuth =function(req,res,next){
    let user = req.profile&&req.auth&&req.profile._id==req.auth._id;
    if(!user){
        return res.status(402).json({
            error:"Access denied"
        });
    }
    next();
}

module.exports.isAdmin = function(req,res,next){
    if(req.profile.role===0){
        return res.status(403).json({
            error:"Admin resource ! Access denied"
        });
    }
    next();
}

