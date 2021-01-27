const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders');

// get all order
router.get('/',  checkAuth , OrdersController.orders_get_all );

//create order
router.post('/', checkAuth ,OrdersController.orders_create_order);

//get single order
router.get('/:orderId',checkAuth , OrdersController.orders_get_single_order);

//update order
router.patch('/:orderId',checkAuth , OrdersController.orders_update_order);

//delete order
router.delete('/:orderId',checkAuth , OrdersController.orders_delete_order);


module.exports = router;