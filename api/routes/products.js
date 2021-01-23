const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
  //reject a file
    if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);  
        cb(new Error('File Uploading Error, Please check file size and filetype, Try Again'))
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

//get all products
router.get('/', (req, res, next) => {
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
});




//create product
router.post('/', upload.single('productImage'), (req, res, next) => {
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
});





//get single product
router.get('/:productId', (req, res, next) => {
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
});






//update product
router.patch('/:productId', (req, res, next) => {
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
});





//delete product
router.delete('/:productId', (req, res, next) => {
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
});






module.exports = router;