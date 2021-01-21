const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

//get all products
router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(result => {
            if (result.length>0) {
                res.status(200).json(result)
            } else {
                res.status(200).json({
                    message: 'No entries found'
                })
            }
        }).catch(err => console.log(err));
});




//create product
router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(200).json({
            created_product: product
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});





//get single product
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
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
            res.status(200).json(result)
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
            res.status(200).json(result)
        }).catch(err => {
            res.status(500).json({error: err})
        });
});

module.exports = router;