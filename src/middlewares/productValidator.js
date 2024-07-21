const { check, validationResult, param, query } = require('express-validator');
// const express=require('express');
// var router = express.Router();
function errorHandler(req, res, next){
  var result={};
      let str = "";
        const errors = validationResult(req).array();
        console.log("Errors",errors)
        if (errors.length > 0) {
            result.status = false;
            result.statusCode = 400;
            for (let i = 0; i < errors.length; i++) {
                // str += errors[i].param + " ";
                str += errors[i].msg + ", ";
            }
            result.message = "Invalid " + str;
            console.log("result.message",result.message)
            res.send(result);
        } else{
          next();
        }
}
exports.errorHandler=(req, res, next)=>{
  var result={};
      let str = "";
        const errors = validationResult(req).array();
        console.log("Errors",errors)
        if (errors.length > 0) {
            result.status = false;
            result.statusCode = 400;
            for (let i = 0; i < errors.length; i++) {
                // str += errors[i].param + " ";
                str += errors[i].msg + ", ";
            }
            result.message = "Invalid " + str;
            console.log("result.message",result.message)
            res.send(result);
        } else{
          next();
        }
}

exports.productValidator= [
    check('product_name').exists()
    .withMessage('Product name is required')
    .not()
    .isEmpty()
    .withMessage('Product name must not be empty')
    .isLength({ min: 1 })
    .withMessage('Product name is required'),

    check('price').exists()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

    check('category_id')
    .exists()
    .withMessage('Category ID is required and must be a positive integer')
    .not()
    .isEmpty()
    .withMessage('Product name must not be empty')
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),

    check('product_description').exists()
    .withMessage('Description is required')
    .not()
    .isEmpty()
    .withMessage('Description must not be empty')
    .isString()
    .withMessage('Input must be a string')
    .isLength({ min: 1 }).withMessage('Description is required')
    // errorHandler(req, res, next)
    // (req, res, next)=>{
    //   var result={};
    //   let str = "";
    //     const errors = validationResult(req).array();
    //     console.log("Errors",errors)
    //     if (errors.length > 0) {
    //         result.status = false;
    //         result.statusCode = 400;
    //         for (let i = 0; i < errors.length; i++) {
    //             // str += errors[i].param + " ";
    //             str += errors[i].msg + ", ";
    //         }
    //         result.message = "Invalid " + str;
    //         console.log("result.message",result.message)
    //         res.send(result);
    //     } else{
    //       next();
    //     }
    // }
   ]

// const productValidationRules = () => {
//     return [
//       check('product_name')
//         .exists()
//         .withMessage('Product name is required')
//         .not()
//         .isEmpty()
//         .withMessage('Product name must not be empty')
//         .isLength({ min: 1 })
//         .withMessage('Product name is required'),
  
//       check('price')
//         .exists()
//         .withMessage('Price is required')
//         .isFloat({ min: 0 })
//         .withMessage('Price must be a positive number'),
  
//       check('category_id')
//         .exists()
//         .withMessage('Category ID is required and must be a positive integer')
//         .not()
//         .isEmpty()
//         .withMessage('Category ID must not be empty')
//         .isInt({ min: 1 })
//         .withMessage('Category ID must be a positive integer'),
  
//       check('product_description')
//         .exists()
//         .withMessage('Description is required')
//         .not()
//         .isEmpty()
//         .withMessage('Description must not be empty')
//         .isString()
//         .withMessage('Input must be a string')
//         .isLength({ min: 1 })
//         .withMessage('Description is required'),
//     ];
//   };
  
//   const commonValidate = (req, res, next) => {
//     const errors = validationResult(req).array();
//     if (errors.length > 0) {
//       const result = {
//         status: false,
//         statusCode: 400,
//         message: "Invalid " + errors.map(error => error.param).join(' '),
//       };
//       res.send(result);
//     } else {
//       next();
//     }
//   };
  
//   module.exports = {
//     productValidationRules,
//     commonValidate
//   };

exports.bulkProductsValidator= [
    check('products.*.product_name')
    .exists()
    .withMessage('Product name is required')
    .not()
    .isEmpty()
    .withMessage('Product name must not be empty'),

    check('products.*.category_id').exists()
    .withMessage('Category ID is required and must be a positive integer')
    .not()
    .isEmpty()
    .withMessage('Product name must not be empty')
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),

    check('products.*.price')
    .exists()
    .withMessage('Price is required')
    .not()
    .isEmpty()
    .withMessage('Description must not be empty')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

    check('products.*.description') 
    .exists()
    .withMessage('Description is required')
    .not()
    .isEmpty()
    .withMessage('Description must not be empty')
    .isLength({ min: 1 }).withMessage('Description is required')
    // (req, res, next)=>{
    //   var result={};
    //   let str = "";
    //     const errors = validationResult(req).array();
    //     console.log("Errors",errors)
    //     if (errors.length > 0) {
    //         result.status = false;
    //         result.statusCode = 400;
    //         for (let i = 0; i < errors.length; i++) {
    //             // str += errors[i].param + " ";
    //             str += errors[i].msg + ", ";
    //         }
    //         result.message = "Invalid " + str;
    //         console.log("result.message",result.message)
    //         res.send(result);
    //     } else{
    //       next();
    //     }
    // }

]

// Validation middleware for category ID parameter
exports.validateCategoryId = [
  param('categoryId').exists()
  .withMessage('Category ID is required and must be a positive integer')
  .isInt().withMessage('Category ID must be an integer')
  // (req, res, next)=>{
  //   var result={};
  //   let str = "";
  //     const errors = validationResult(req).array();
  //     console.log("Errors",errors)
  //     if (errors.length > 0) {
  //         result.status = false;
  //         result.statusCode = 400;
  //         for (let i = 0; i < errors.length; i++) {
  //             // str += errors[i].param + " ";
  //             str += errors[i].msg + ", ";
  //         }
  //         result.message = "Invalid " + str;
  //         console.log("result.message",result.message)
  //         res.send(result);
  //     } else{
  //       next();
  //     }
  // }
];

// Validation middleware for search query parameter
exports.validateSearchQuery = [
  query('q').notEmpty().withMessage('Search query parameter (q) is required')
  // (req, res, next)=>{
  //   var result={};
  //   let str = "";
  //     const errors = validationResult(req).array();
  //     console.log("Errors",errors)
  //     if (errors.length > 0) {
  //         result.status = false;
  //         result.statusCode = 400;
  //         for (let i = 0; i < errors.length; i++) {
  //             // str += errors[i].param + " ";
  //             str += errors[i].msg + ", ";
  //         }
  //         result.message = "Invalid " + str;
  //         console.log("result.message",result.message)
  //         res.send(result);
  //     } else{
  //       next();
  //     }
  // }
];

// Validation middleware for pagination
exports.validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  // (req, res, next)=>{
  //   var result={};
  //   let str = "";
  //     const errors = validationResult(req).array();
  //     console.log("Errors",errors)
  //     if (errors.length > 0) {
  //         result.status = false;
  //         result.statusCode = 400;
  //         for (let i = 0; i < errors.length; i++) {
  //             // str += errors[i].param + " ";
  //             str += errors[i].msg + ", ";
  //         }
  //         result.message = "Invalid " + str;
  //         console.log("result.message",result.message)
  //         res.send(result);
  //     } else{
  //       next();
  //     }
  // }
];

exports.bulkUpdateProductsValidator= async(req, res, next)=>{
    check('products.*.id').isInt({ min: 1 }).withMessage('Product ID is required and must be a positive integer'),

    check('products.*.product_name').isLength({ min: 1 }).withMessage('Product name is required'),
    check('products.*.category_id').isInt({ min: 1 }).withMessage('Category ID is required and must be a positive integer'),
    check('products.*.price').isFloat({ min: 0 }).withMessage('Price is required and must be a positive number'),
    check('products.*.description').isLength({ min: 1 }).withMessage('Description is required')
    next();
}

