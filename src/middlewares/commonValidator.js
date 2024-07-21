const { check, validationResult, param, query } = require('express-validator');
const con = require("../database/mysqlCon");  

// exports.errorHandler=(req, res, next)=>{
//   var result={};
//       let str = "";
//         const errors = validationResult(req).array();
//         console.log("Errors",errors)
//         if (errors.length > 0) {
//             result.status = false;
//             result.statusCode = 400;
//             for (let i = 0; i < errors.length; i++) {
//                 // str += errors[i].param + " ";
//                 str += errors[i].msg + ", ";
//             }
//             result.message = "Invalid " + str;
//             console.log("result.message",result.message)
//             res.send(result);
//         } else{
//           next();
//         }
// }

exports.errorHandler = (req, res, next) => {
    var result = {};
    let str = "";
    const errors = validationResult(req).array();
    console.log("Errors", errors);
    if (errors.length > 0) {
      result.status = false;
      result.statusCode = 400;
      for (let i = 0; i < errors.length; i++) {
        // str += errors[i].param + " ";
        str += errors[i].msg + ", ";
      }
      result.message = "Invalid " + str;
      console.log("result.message", result.message);
      res.send(result);
    } else if (req.customValidationErrorMessage) {
      // If there's a custom validation error message, handle it here
      result.status = false;
      result.statusCode = 400;
      result.message = `Custom Validation Error: ${req.customValidationErrorMessage}`;
      console.log("result.message", result.message);
      res.send(result);
    } else {
      next();
    }
  };

  exports.errorHandler1 = (req, res, next) => {
    var result = {};
    let str = "";
    
    // Handle errors from customValidationErrorMessage
    if (req.customValidationErrorMessage) {
      result.status = false;
      result.statusCode = 400;
      result.message = `Custom Validation Error: ${req.customValidationErrorMessage}`;
      console.log("result.message", result.message);
    }

    // Handle errors from validationResult
    const errors = validationResult(req).array();
    console.log("Errors", errors);
    if (errors.length > 0) {
      for (let i = 0; i < errors.length; i++) {
        str += errors[i].msg + ", ";
      }
      result.status = false;
      result.statusCode = 400;
      result.message = (result.message ? result.message + "\n" : "") + "Invalid " + str;
      console.log("result.message", result.message);
    }

    // If there are no errors, proceed to the next middleware
    if (!result.status) {
      next();
    }

    
};
exports.errorHandler2 = (req, res, next) => {
  var result = {};
  var str = "";
  console.log("Control is here in errorHandler2 on top");
  // result.status=true;
  console.log("req.customUserValidationErrorMessage",req.customUserValidationErrorMessage);
  console.log("req.customProductValidationErrorMessage",req.customProductValidationErrorMessage);

  // Handle errors from customValidationErrorMessage
  if (req.customUserValidationErrorMessage) {
    result.status = false;
    result.statusCode = 400;
    result.message = `Custom User Validation Error: ${req.customUserValidationErrorMessage}`;
    console.log("result.message", result.message);
  }

  // Handle errors from customProductValidationErrorMessage
  if (req.customProductValidationErrorMessage) {
    result.status = false;
    result.statusCode = 400;
    result.message = (result.message ? result.message + "\n" : "") + req.customProductValidationErrorMessage;
    console.log("result.message", result.message);
  }

  // Handle errors from validationResult
  const errors = validationResult(req).array();
  console.log("Errors", errors);
  if (errors.length > 0) {
      for (let i = 0; i < errors.length; i++) {
          str += errors[i].msg + ", ";
      }
      result.status = false;
      result.statusCode = 400;
      result.message = (result.message ? result.message + "\n" : "") + "Invalid " + str;
      console.log("result.message", result.message);
  }
  // If there are no errors, set status to true
  if (!result.hasOwnProperty('status')) {
    result.status = true;
  }
  // If there are no errors, proceed to the next middleware
  console.log("result.status",result.status)
  console.log("!result.status",!result.status)

  if (!result.status) {
    return res.send(result)
  }

  next();

  
};
// exports.checkProductId=async(value)=>{
//   return new Promise((resolve, reject)=>{
//     con.query('SELECT * FROM products WHERE product_id=?',[value], async(err,dbResult)=>{
//         if(err){
//             console.log(`product_id validator Error:${err.toString()}`)

//             return reject(new Error(`product_id validator Database Error:${err.toString()}`))
//         }
//         if(dbResult && dbResult.length>0){
//             if(dbResult[0].product_id===value){
//                 return resolve()
//             }
//         }
//         console.log(`This product_id does not belong to any product`)

//         return reject(new Error(`This product_id does not belong to any product`))

//     })
// })
// }

exports.checkProductId = (value) => {
  return new Promise((resolve, reject) => {
      con.query('SELECT * FROM products WHERE product_id=?', [value], (err, dbResult) => {
          if (err) {
              console.log(`product_id validator Error: ${err.toString()}`);
              return reject(new Error(`product_id validator Database Error: ${err.toString()}`));
          }
          console.log("dbResult product type of",typeof(dbResult));
          console.log("dbResul product",dbResult);
          console.log("dbResul[0] product",dbResult[0]);
          // console.log("dbResul[0] product_id",dbResult[0].product_id);
          // console.log("dbResul[0] product_id===value? ",dbResult[0].product_id === value);
          if (dbResult && dbResult.length > 0 && dbResult[0].product_id === value) {
              resolve(); // Resolve the promise if product_id is valid
          } else {
              console.log(`This product_id does not belong to any product`);
              return reject(new Error(`This product_id does not belong to any product`));
          }
      });
  });
};

exports.verifyQuantity = (product_id, quantity) => {
  return new Promise((resolve, reject) => {
      con.query('SELECT * FROM inventory WHERE product_id=?', [product_id], (err, dbResult) => {
          if (err) {
              console.log(`product_id validator Error: ${err.toString()}`);
              return reject(new Error(`product_id validator Database Error: ${err.toString()}`));
              // return reject(`product_id validator Database Error: ${err.toString()}`);
          }
          console.log("product_id",product_id);
          console.log("quantity",quantity);
          console.log("dbResult quantity type of",typeof(dbResult));
          console.log("dbResul quantity",dbResult);
          console.log("dbResul[0] quantity",dbResult[0]);
          // console.log("dbResul[0] quantity inventory_count",dbResult[0].inventory_count);
          // console.log("dbResul[0] inventory_count===value? ",dbResult[0].inventory_count >= quantity);
          if (dbResult && dbResult.length > 0 && dbResult[0].inventory_count >= quantity) {
              resolve(); // Resolve the promise if product_id is valid
          } else {
              console.log(`This product_id does not belong to any product or selected quantity exceeds the available count`);
              return reject(new Error(`This product_id does not belong to any product or selected quantity exceeds the available count`));
              // return reject(`This product_id does not belong to any product`);
          }
      });
  });
};

exports.checkUserId = (value) => {
  return new Promise((resolve, reject) => {
      con.query('SELECT * FROM users WHERE user_id=?', [value], (err, dbResult) => {
          if (err) {
              console.log(`user_id validator Error: ${err.toString()}`);
              return reject(new Error(`user_id validator Database Error: ${err.toString()}`));
              // return reject(`user_id validator Database Error: ${err.toString()}`);

          }
          console.log("dbResult user type of",typeof(dbResult));
          console.log("dbResul user",dbResult);
          console.log("dbResul[0] user",dbResult[0]);
          // console.log("dbResul[0] user_id",dbResult[0].user_id);
          // console.log("dbResul[0] user_id===value? ",dbResult[0].user_id === value);
          if (dbResult && dbResult.length > 0 && dbResult[0].user_id === value) {
              resolve(); // Resolve the promise if product_id is valid
          } else {
              console.log(`This user_id does not belong to any product`);
              return reject(new Error(`This user_id does not belong to any product`));
              // return reject(`This user_id does not belong to any product`);

          }
      });
  });
};




// exports.CommonValidate = (req, res, next) => {
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