var express = require('express');
var router = express.Router();
const {addToCartValidator, removeFromCartValidator}=require('../middlewares/cartValidator')
const cartController=require('../controllers/cartControllers');

router.post('/add',addToCartValidator,cartController.addToCart);
router.post('/remove',removeFromCartValidator, cartController.removeFromCart);


module.exports=router;