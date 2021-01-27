const mongoose = require('mongoose');
const Order =  require('../models/order');
const Product =  require('../models/product');

exports.products_get_all_products = (req, res, next) => {
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(results => {
            if (results.length > 0) {
                const response = {
                    count: results.length,
                    products: results.map(result => {
                        return {
                            name: result.name,
                            price: result.price,
                            productImage: result.productImage,
                            _id: result._id,
                            request: {
                                type: 'GET',
                                url: 'http://127.0.0.1:3000/products/'+result._id
                            }
                        }
                    })
                };
                res.status(200).json(response);
            } else {
                res.status(200).json({
                    message: 'No entries found'
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.products_create_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
        .then(result => {
            res.status(201).json({
                message: 'Product created successfully',
                created_product: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'POST',
                        url:'http://127.0.0.1:3000/products/'+result._id
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
    });
};

exports.products_get_single_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select("name price _id productImage")
        .exec()
        .then(result => {
            res.status(200).json({
                product: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url:'http://127.0.0.1:3000/products/'+result._id
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
}


exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    Product.updateOne({ _id: id },
        {
            $set: {
                name: req.body.name,
                price: req.body.price
            }
        }).exec()
        .then(result => {
            res.status(200).json({
                updated_product: {
                    name: result.name,
                    price: result.price,
                    request: {
                        type: 'PATCH',
                        url:'http://127.0.0.1:3000/products/'+result._id
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
};


exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                create_new_product: {
                    request: {
                        type: 'POST',
                        url: 'http://127.0.0.1:3000/products',
                        data: {
                            name: 'String',
                            price: 'Number'
                        }
                    }
                }
            })
        }).catch(err => {
            res.status(500).json({error: err})
        });
}