const formidable = require('formidable'); // used for image uploads.
const _ = require('lodash');
const Product = require('../models/product');
const fs = require('fs');
const handleError = require('../helpers/dbErrorHandler');

module.exports.productById = function(req,res,next,id){
    Product.findById(id,function(err,product){
        if(err||!product){
            return res.status(400).json({
                error:"Product not found"
            });
        }
        else{
            req.product = product;
        }
        next();
    });
}

module.exports.create = function(req,res){
    const form = formidable({keepExtensions:true});
    form.parse(req,function(err,fields,files){
        if(err){
            console.log(Error);
            return res.status(400).json({
                error:"Image could not be uploaded"
            });
        }
        else{
            // check for all fields.
            const {name,description,price,category,quantity,shipping} = fields;
            if(!name||!description||!price||!category||!quantity||!shipping){
                return res.status(400).json({
                    error:"All fields are required"
                });
            }
            let product = new Product(fields);
            if(files.photo){
                if(files.photo.size>1000000){
                    return res.status(400).json({
                        error:"Image should be less than 1mb in size"
                    });
                }
                else{
                    product.photo.data = fs.readFileSync(files.photo.filepath);
                    product.photo.contentType = files.photo.mimetype;
                }
            }
            product.save(function(err,result){
                if(err){
                    console.log('Not able to save');
                    return res.status(400).json({
                        error:handleError.errorHandler(err)
                    });
                }
                else{
                    return res.json(result);
                }
            });
        }
    });
}

module.exports.read = function(req,res){
    req.product.photo = undefined; //Dont send image bcz it is too large.
    return res.json(req.product);
}

module.exports.remove = function(req,res){
    let product = req.product;
    product.remove(function(err){
        if(err){
            return res.status(400).json({
                error:handleError.errorHandler(err)
            });
        }
        else{
            return res.json({
                message:"Product deleted successfully"
            });
        }
    });
}

module.exports.update = function(req,res){
    const form = formidable({keepExtensions:true});
    form.parse(req,function(err,fields,files){
        if(err){
            console.log(Error);
            return res.status(400).json({
                error:"Image could not be uploaded"
            });
        }
        else{
            // check for all fields.
            const {name,description,price,category,quantity,shipping} = fields;
            if(!name||!description||!price||!category||!quantity||!shipping){
                return res.status(400).json({
                    error:"All fields are required"
                });
            }
            let product = req.product;
            // update the product
            product = _.extend(product,fields);
            if(files.photo){
                if(files.photo.size>1000000){
                    return res.status(400).json({
                        error:"Image should be less than 1mb in size"
                    });
                }
                else{
                    product.photo.data = fs.readFileSync(files.photo.filepath);
                    product.photo.contentType = files.photo.mimetype;
                }
            }
            product.save(function(err,result){
                if(err){
                    console.log('Not able to save');
                    return res.status(400).json({
                        error:handleError.errorHandler(err)
                    });
                }
                else{
                    return res.json(result);
                }
            });
        }
    });
}