const Category = require('../models/category');
const handleError = require('../helpers/dbErrorHandler');

module.exports.create = function(req,res){
    Category.create(req.body,function(err,data){
        if(err){
            console.log(req.body);
            console.log(err);
            return res.status(400).json({
                error:handleError.errorHandler(err)
            });
        }
        else{
            return res.json({data});
        }
    });
}