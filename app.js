const express = require('express');
const app = express();
require('dotenv').config();
const morgan = require('morgan');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb+srv://araliyamapa:'+ process.env.MONGODB_ATLAS_PASSWORD +'@cluster0.e74uy.mongodb.net/node_rest_api?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
})

// app.use((req, res, next) => {
//     res.status(200).json({
//          "message": 'It Works'
//     });
// });

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Handling cors errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With,Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET', 'PUT', 'POST', 'PATCH', 'DELETE');
        return res.status(200).json({});
    }
    next();
})

//Routes which handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//handling req errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});



//mongodb+srv://araliyamapa:araliyamapa@cluster0.e74uy.mongodb.net/node_rest_api?retryWrites=true&w=majority

module.exports =  app;