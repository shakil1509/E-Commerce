var express = require('express');
var router = express.Router();
// const { check, validationResult } = require('express-validator');
// const commonValidate=require('../middlewares/commonValidator')
// const con = require("../database/mysqlCon");
// const {router, productValidationRules, commonValidate } = require('../middlewares/productValidator')
const {productValidator, bulkProductsValidator, validateCategoryId, validateSearchQuery, validatePagination,errorHandler}= require('../middlewares/productValidator');
const productController=require('../controllers/productController');

// router.post('/products',[
//     check('product_name').exists()
// .withMessage('Product name is required')
// .not()
// .isEmpty()
// .withMessage('Product name must not be empty')
// .isLength({ min: 1 })
// .withMessage('Product name is required'),

// check('price').exists()
// .withMessage('Price is required')
// .isFloat({ min: 0 })
// .withMessage('Price must be a positive number'),

// check('category_id')
// .exists()
// .withMessage('Category ID is required and must be a positive integer')
// .not()
// .isEmpty()
// .withMessage('Product name must not be empty')
// .isInt({ min: 1 })
// .withMessage('Category ID must be a positive integer'),

// check('product_description').exists()
// .withMessage('Description is required')
// .not()
// .isEmpty()
// .withMessage('Description must not be empty')
// .isString()
// .withMessage('Input must be a string')
// .isLength({ min: 1 }).withMessage('Description is required')],async (req, res, next) => {
//     var result = {};
//     try {
//         let str = "";
//         const errors = validationResult(req).array();
//         console.log("errors:",errors)
//         if (errors.length > 0) {
//             result.status = false;
//             result.statusCode = 400;
//             for (let i = 0; i < errors.length; i++) {
//                 str += errors[i].param + " ";
//             }
//             result.message = "Invalid " + str;
//             //result.message = errors
//             console.log("result",result)
//             res.send(result);
//         } else {
//             const { product_name, price, category_id, product_description } = req.body;

//             con.query('INSERT INTO products (product_name, price, category_id, product_description) VALUES (?, ?, ?, ?)', [product_name, price, category_id, product_description], (err, results) => {
//                 if (err) {
//                     result.status = false;
//                     result.statusCode = 500;
//                     result.message = `Database Error:${err.toString()}`;
//                     res.send(result);
//                 }
//                 result.status = true;
//                 result.statusCode = 201;
//                 // result.message = (`Products created successfully , category_id: ${results.insertId}`);
//                 result.message = (`Products created successfully `);
//                 result.data = results;
//                 res.send(result);
//             })
//         }
//     } catch (err) {
//         // console.log("inside catch error", err)
//         result.status = false;
//         result.statusCode = 400;
//         result.message = err.toString();
//         res.send(result);
//     }
// });

// router.post('/products',[
//     check('product_name')
//       .exists()
//       .withMessage('Product name is required')
//       .not()
//       .isEmpty()
//       .withMessage('Product name must not be empty')
//       .isLength({ min: 1 })
//       .withMessage('Product name is required'),

//     check('price')
//       .exists()
//       .withMessage('Price is required')
//       .isFloat({ min: 0 })
//       .withMessage('Price must be a positive number'),

//     check('category_id')
//       .exists()
//       .withMessage('Category ID is required and must be a positive integer')
//       .not()
//       .isEmpty()
//       .withMessage('Category ID must not be empty')
//       .isInt({ min: 1 })
//       .withMessage('Category ID must be a positive integer'),

//     check('product_description')
//       .exists()
//       .withMessage('Description is required')
//       .not()
//       .isEmpty()
//       .withMessage('Description must not be empty')
//       .isString()
//       .withMessage('Input must be a string')
//       .isLength({ min: 1 })
//       .withMessage('Description is required'),
//   ],async (req, res, next) => {
//     var result = {};
//     try {
//         const errors = validationResult(req).array();
//         if (errors.length > 0) {
//           const result = {
//             status: false,
//             statusCode: 400,
//             message: "Invalid " + errors.map(error => error.param).join(' '),
//           };
//           res.send(result);
//         } else {
//             const { product_name, price, category_id, product_description } = req.body;
  
//             con.query('INSERT INTO products (product_name, price, category_id, product_description) VALUES (?, ?, ?, ?)', [product_name, price, category_id, product_description], (err, results) => {
//               if (err) {
//                 result.status = false;
//                 result.statusCode = 500;
//                 result.message = `Database Error:${err.toString()}`;
//                 res.send(result);
//               }
//               result.status = true;
//               result.statusCode = 201;
//               result.message = (`Products created successfully, category_id: ${results.insertId}`);
//               result.data = results;
//               res.send(result);
//             });
//         }
//     } catch (err) {
//       result.status = false;
//       result.statusCode = 400;
//       result.message = err.toString();
//       res.send(result);
//     }  
// });
// router.post('/products',productValidator.productValidator,productController.productCreation);
router.post('/bulkProducts',bulkProductsValidator,errorHandler,productController.productBulkCreation);

// router.post('/products',productValidator,productController.productCreation);
router.post('/products',productValidator,errorHandler,productController.productCreation);


router.get('/products',productController.fetchProducts);
// Get products by category
router.get('/products/by-category/:categoryId',[validateCategoryId, validatePagination],errorHandler,productController.getProductsbyCategoryID)

router.get('/products/search', [validateSearchQuery, validatePagination],errorHandler,productController.productsSearch)

// router.put('/products/:id',productValidator.productValidator,productController.productUpdation);
// router.put('/bulkProducts/:id',productValidator.bulkProductsValidator,
// productController);


router.delete('/products/:id',productController.productDeletion);
router.delete('/bulkProducts',productController.productBulkDeletion);


module.exports=router;