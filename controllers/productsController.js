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

module.exports.list = function(req,res){
    let order = req.query.order?req.query.order:'asc';
    let sortBy = req.query.sortBy?req.query.sortBy:'_id';
    let limit = req.query.limit?parseInt(req.query.limit):10;

    Product.find()
    .select("-photo")
    .populate('category')
    .sort([[sortBy,order]])
    .limit(limit)
    .exec(function(err,products){
        if(err){
            return res.status(400).json({
                error:"Products not found"
            });
        }
        else{
            return res.json(products);
        }
    });
}

// other products that have the same category will be returned.
module.exports.relatedProducts = function(req,res){
    let limit = req.query.limit?parseInt(req.query.limit):10;
    //Find all the products related to current product, not including the current product.
    Product.find({_id:{$ne:req.product},category:req.product.category})
    .limit(limit)
    .populate('category','_id name')
    .exec(function(err,products){
        if(err){
            return res.status(400).json({
                error:"Products not found"
            });
        }
        else{
            return res.json(products);
        }
    });
}

module.exports.productCategories = function(req,res){
    // Number of distinct categories of which products are available in our database.
    Product.distinct("category",{},function(err,categories){
        if(err){
            return res.status(400).json({
                error:"Categories not found"
            });
        }
        else{
            return res.json(categories);
        }
    });
}

module.exports.listBySearch = function(req,res){
    let order = req.body.order ? req.body.order:"desc";
    let sortBy = req.body.sortBy ? req.body.sortBy:"_id";
    let limit = req.body.limit ? parseInt(req.body.limit):100;
    let skip = parseInt(req.body.skip); // used for load more button
    let findArgs = {};

    for(let key in req.body.filters){
        if(req.body.filters[key].length>0){
            if(key=="price"){
                findArgs[key]={
                    $gte:req.body.filters[key][0],
                    $lte:req.body.filters[key][1]
                };
            }
            else{
                findArgs[key]=req.body.filters[key];
            }
        }
    }
    Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy,order]])
    .skip(skip)
    .limit(limit)
    .exec(function(err,data){
        if(err){
            return res.status(400).json({
                error:"Products not found"
            });
        }
        else{
            return res.json({
                size:data.length,
                data
            });
        }
    });
}

module.exports.getPhoto = function(req,res,next){
    if(req.product.photo.data){
        res.set('Content-Type',req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}