var express = require('express');
var router = express.Router();

const {errorHandler}=require('../middlewares/commonValidator');
const {getInventoryCountValidator,updateInventoryCountValidator}= require('../middlewares/inventoryValidator');
const inventoryController=require('../controllers/inventoryController');



// router.get('/get',getInventoryCountValidator,inventoryController.getInventoryCount);
router.get('/get',getInventoryCountValidator,errorHandler,inventoryController.getInventoryCount);

router.post('/updateInventoryCount',updateInventoryCountValidator,errorHandler,inventoryController.updateInventoryCount);

module.exports=router;
