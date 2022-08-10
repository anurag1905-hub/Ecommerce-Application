const Category = require('../models/category');
const handleError = require('../helpers/dbErrorHandler');

module.exports.categoryById = function (req, res, next, id) {
    Category.findById(id, function (err, category) {
        if (err||!category) {
            return res.status(400).json({
                error: 'Either there was an error or the category does not exist'
            });
        }
        else{
            req.category=category;
        }
        next();
    });
}

module.exports.read = function(req,res){
    return res.json(
        req.category
    );
}

module.exports.create = function (req, res) {
    Category.create(req.body, function (err, data) {
        if (err) {
            console.log(req.body);
            console.log(err);
            return res.status(400).json({
                error: handleError.errorHandler(err)
            });
        }
        else {
            return res.json({ data });
        }
    });
}

module.exports.update = function(req,res){
    const category = req.category;
    console.log(category);
    category.name = req.body.name;
    console.log(category.name);
    category.save(function(err,data){
        if(err){
            return res.status(400).json({
                error:handleError.errorHandler(err)
            });
        }
        else{
            return res.json(data);
        }
    });
}

module.exports.remove = function(req,res){
    const category = req.category;
    category.remove(function(err){
        if(err){
            return res.status(400).json({
                error:handleError.errorHandler(err)
            });
        }
        else{
            return res.json({
                message:"Category deleted successfully."
            });
        }
    });
}

module.exports.list = function(req,res){
    Category.find({},function(err,data){
        if(err){
            return res.status(400).json({
                error:handleError.errorHandler(err)
            });
        }
        else {
            return res.json(data);
        }
    });
}