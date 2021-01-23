const { request } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');


// get all order
router.get('/', (req, res, next) => {
    Order.find()
        .exec()
        .then(results => {
            if (results.length > 0) {
                const response = {
                    count: results.length,
                    products: results.map(result => {
                        return {
                            product: result.product,
                            quantity: result.quantity,
                            _id: result._id,
                            request: {
                                type: 'GET',
                                url: 'http://127.0.0.1:3000/orders/'+result._id
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
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        } )
});




//create order
router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product Not Found!"
                })
            }
        const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
    return order.save()
        .then(results => {
            console.log(results);
            res.status(201).json({
                message: 'Order created',
                createdOrder: {
                    _id: results._id,
                    product: results.product,
                    quantity: results.quantity
                },
                request: {
                    type: 'POST',
                    url: 'http://127.0.0.1:3000/orders'
                }
            })
        })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        }); 
});





//get single order
router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                   message: 'Order not found'
               }) 
            }
            res.status(200).json({
                order: result,
                request: {
                    type: 'GET',
                    url: 'http://127.0.0.1:3000/orders/' + result._id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error:  err
            })
        })
});




//update order
router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.updateOne({ _id: id },
        {
            $set: {
                quantity: req.body.quantity
            }
        }).exec()
        .then(result => {
            res.status(200).json({
                message: 'order has been updated',
                updated_order: {
                    orderId: id,
                    quantity: req.body.quantity,
                    request: {
                        type: 'PATCH',
                        url:'http://127.0.0.1:3000/orders/'+id
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



//delete order
router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .then(doc => {
            if (!doc) {
                return res.status(404).json({
                     message: 'Order Not Found'
                })
            }
            Order.remove({_id : id})
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Order deleted',
                        create_new_order: {
                            type: 'POST',
                            url: 'http://127.0.0.1:3000/orders/',
                            data: {
                                productId: "ID",
                                quantity: "Number"
                            }
                        }
                    })
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            })
});


module.exports = router;