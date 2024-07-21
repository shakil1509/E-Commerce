var express = require('express');
var router = express.Router();
const categoryValidator=require('../middlewares/categoryValidator');
const categoryController=require('../controllers/categoryController');

router.post('/categories',categoryValidator.categoryValidator,
categoryController.categoryCreation);

router.get('/categories',categoryController.fetchCategories);

router.put('/categories/:id',categoryValidator.categoryValidator,
categoryController.categoryUpdation)

router.delete('/categories/:id',categoryController.categoryDeletion)

module.exports=router;