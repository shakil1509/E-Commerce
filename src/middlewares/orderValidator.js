const { check, validationResult, param, query, body } = require('express-validator');
const con = require("../database/mysqlCon");
const {checkProductId, checkUserId, verifyQuantity}=require('../middlewares/commonValidator');

// exports.bookingValidator=[
//     check('product_id').exists()
//       .withMessage('product_id is required')
//       .not()
//       .isEmpty()
//       .withMessage('product_id must not be empty')
//       .custom(async (value, { req }) => {
//         try {
//           await checkProductId(value);
//           return true; // Return true if the validation passes
//         } catch (error) {
//           console.log("error occurred in catch of custom", error.toString());
//           // Instead of throwing an error, store the error message in a variable
//           req.customValidationErrorMessage = error.message;
//           return false; // Return false if the validation fails
//         }
//       }),
//     check('user_id').exists()
//     .withMessage('user_id is required')
//     .not()
//     .isEmpty()
//     .withMessage('user_id must not be empty')
//     .custom(async (value, { req }) => {
//         try {
//           await checkUserId(value);
//           return true; // Return true if the validation passes
//         } catch (error) {
//           console.log("error occurred inside catch of custom", error.toString());
//           // Instead of throwing an error, store the error message in a variable
//           req.customValidationErrorMessage = error.message;
//           return false; // Return false if the validation fails
//         }
//       })
//   ];

exports.ordersValidator=[
    check('user_id').exists()
    .withMessage('user_id is required')
    .not()
    .isEmpty()
    .withMessage('user_id must not be empty')
    .custom(async (value, { req }) => {
        try {
          await checkUserId(value);
          return true; // Return true if the validation passes
        } catch (error) {
          console.log("error occurred inside catch of custom", error.toString());
          // Instead of throwing an error, store the error message in a variable
          req.customUserValidationErrorMessage = error.message;
          return false; // Return false if the validation fails
        }
    }),
    body('cartItems')
    .isArray({ min: 1 })
    .withMessage('cartItems must be an array with at least one item')
    .custom(async(value, { req }) => {
      // Validate each item in cartItems
      for (const item of value) {
        if (!item.product_id || !item.quantity) {
          console.error("Each item in cartItems must have product_id and quantity");
          req.customProductValidationErrorMessage ="Each item in cartItems must have product_id and quantity"
        //   throw new Error('Each item in cartItems must have product_id and quantity');
        }
        // Add additional validation for quantity if needed
        if (item.quantity < 0) {
            console.error("Quantity must be greater than or equal to 0");
            req.customProductValidationErrorMessage = "Quantity must be greater than or equal to 0";
          //   throw new Error("Quantity must be greater than or equal to 0");
        }

        // Validate product_id and quantity using custom functions
        try {
          await checkProductId(item.product_id);
          await verifyQuantity(item.product_id, item.quantity);
          console.log("Control is here check product and verify quantity");

        } catch (error) {
          console.error("Error occurred in product_id/quantity validation:", error.toString());
          req.customProductValidationErrorMessage = error.message;
        //   throw new Error(`Invalid product_id: ${error.message}`);
        }
      }
      console.log("Control is next to return true in orders validator");
      return true;
    })
  ];