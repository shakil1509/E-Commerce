var express = require('express');
var router = express.Router();
const {errorHandler1, errorHandler2}=require('../middlewares/commonValidator');
const {ordersValidator}=require('../middlewares/orderValidator');
const orderController=require('../controllers/orderController');

router.post('/createOrder',ordersValidator,errorHandler2,orderController.createOrder)


module.exports=router;