const { check, validationResult, param, query } = require('express-validator');
const con = require("../database/mysqlCon");
const {checkProductId}=require('../middlewares/commonValidator');
// const {errorHandler}=require('../middlewares/commonValidator');


// exports.getInventoryCountValidator=[
//   check('product_id').exists()
//   .withMessage('product_id is required')
//   .not()
//   .isEmpty()
//   .withMessage('product_id must not be empty')
//   .custom(async value=>{
//       return new Promise((resolve, reject)=>{
//           con.query('SELECT * FROM products WHERE product_id=?',[value], async(err,dbResult)=>{
//               if(err){
//                   console.log(`product_id validator Error:${err.toString()}`)
  
//                   return reject(new Error(`product_id validator Database Error:${err.toString()}`))
//               }
//               if(dbResult && dbResult.length>0){
//                   if(dbResult[0].product_id===value){
//                       return resolve()
//                   }
//               }
//               console.log(`This product_id does not belong to any product`)
  
//               return reject(new Error(`This product_id does not belong to any product`))
  
//           })
//       })
//   })
// ]

// exports.getInventoryCountValidator=[
//   check('product_id').exists()
//   .withMessage('product_id is required')
//   .not()
//   .isEmpty()
//   .withMessage('product_id must not be empty')
//   .custom(async (value, { req }) => {
//       try {
//           await checkProductId(value);
//       } catch (error) {
//           console.log("error occured in catch of custom", error.toString())
//           throw new Error(error.message);
//       }
//   })
// ]

exports.getInventoryCountValidator = [
  check('product_id').exists()
    .withMessage('product_id is required')
    .not()
    .isEmpty()
    .withMessage('product_id must not be empty')
    .custom(async (value, { req }) => {
      try {
        await checkProductId(value);
        return true; // Return true if the validation passes
      } catch (error) {
        console.log("error occurred in catch of custom", error.toString());
        // Instead of throwing an error, store the error message in a variable
        req.customValidationErrorMessage = error.message;
        return false; // Return false if the validation fails
      }
    }),
];

exports.updateInventoryCountValidator = [
  check('product_id').exists()
    .withMessage('product_id is required')
    .not()
    .isEmpty()
    .withMessage('product_id must not be empty')
    .custom(async (value, { req }) => {
      try {
        await checkProductId(value);
        return true; // Return true if the validation passes
      } catch (error) {
        console.log("error occurred in catch of custom", error.toString());
        // Instead of throwing an error, store the error message in a variable
        req.customValidationErrorMessage = error.message;
        return false; // Return false if the validation fails
      }
    }),
    check('inventory_count').exists()
    .withMessage('inventory_count is required')
    .not()
    .isEmpty()
    .withMessage('inventory_count must not be empty')
];

// exports.getInventoryCountValidator = [
//   check('product_id').exists()
//     .withMessage('product_id is required')
//     .not()
//     .isEmpty()
//     .withMessage('product_id must not be empty')
//     .custom(async value=>{
//         return new Promise((resolve, reject)=>{
//             con.query('SELECT * FROM products WHERE product_id=?',[value], async(err,dbResult)=>{
//                 if(err){
//                     console.log(`product_id validator Error:${err.toString()}`)
    
//                     return reject(new Error(`product_id validator Database Error:${err.toString()}`))
//                 }
//                 console.log("dbResult",dbResult);
//                 console.log("dbResult[0]",dbResult[0]);
//                 console.log("dbResult type of",typeof(dbResult));
//                 if(dbResult && dbResult.length>0){
//                     if(dbResult[0].product_id===value){
//                         return resolve()
//                     }
//                 }
//                 console.log(`This product_id does not belong to any product`)
    
//                 return reject(new Error(`This product_id does not belong to any product`))
    
//             })
//         })
//     }),
//     async(req, res, next) => {
//       var result = {};
//       let str = "";
//       const errors = validationResult(req).array();
//       console.log("Errors", errors);
//       if (errors.length > 0) {
//         result.status = false;
//         result.statusCode = 400;
//         for (let i = 0; i < errors.length; i++) {
//           // str += errors[i].param + " ";
//           str += errors[i].msg + ", ";
//         }
//         result.message = "Invalid " + str;
//         console.log("result.message", result.message);
//         res.send(result);
//       } else if (req.customValidationErrorMessage) {
//         // If there's a custom validation error message, handle it here
//         result.status = false;
//         result.statusCode = 400;
//         result.message = `Custom Validation Error: ${req.customValidationErrorMessage}`;
//         console.log("result.message", result.message);
//         res.send(result);
//       } else {
//         next();
//       }
//     }
    
// ];

// exports.errorHandler = errorHandler; 

// Your route handler
// exports.getInventoryCountValidator = async (req, res, next) => {
//     try {
//       await Promise.all([
//         check('product_id').exists()
//           .withMessage('product_id is required')
//           .not()
//           .isEmpty()
//           .withMessage('product_id must not be empty')
//           .custom(async (value) => {
//             // Use the custom validator and check for a boolean result
//             const isValid = await checkProductId(value);
  
//             // If validation failed, send a response to the client
//             if (!isValid) {
//               return Promise.reject('Invalid product_id');
//             }
//           }),
//         // ... other validation rules
//       ]);
  
//       // If all validations pass, continue to the next middleware or route handler
//       next();
//     } catch (error) {
//         //Handle the validation error and send a response to the client
//         console.error(`Validation error: ${error}`);
//         //res.status(400).json({ error: 'Invalid input', details: error });
//         const result={}
//         result.status = false;
//         result.statusCode = 500;
//         result.message = `Input Validation error:${error.toString()}`;
//         res.send(result);
//     }
//   };
  
  // Your route handler continues here
  