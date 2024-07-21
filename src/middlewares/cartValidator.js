const { check, validationResult, param, query } = require('express-validator');
const con = require("../database/mysqlCon");  

// exports.addToCartValidator=[
//     check('user_id').exists()
//     .withMessage('user_id is required')
//     .not()
//     .isEmpty()
//     .withMessage('user_id must not be empty'),
//     check('product_id').exists()
//     .withMessage('product_id is required')
//     .not()
//     .isEmpty()
//     .withMessage('product_id must not be empty'),
//     check('quantity')
//       .isInt({ min: 1 }),
      
//       (req, res, next)=>{
//         var result={};
//         let str = "";
//           const errors = validationResult(req).array();
//           console.log("Errors",errors)
//           if (errors.length > 0) {
//               result.status = false;
//               result.statusCode = 400;
//               for (let i = 0; i < errors.length; i++) {
//                   // str += errors[i].param + " ";
//                   str += errors[i].msg + ", ";
//               }
//               result.message = "Invalid " + str;
//               console.log("result.message",result.message)
//               res.send(result);
//           } else{
//             next();
//           }
//       }
// ]

exports.addToCartValidator=[
    check('user_id').exists()
    .withMessage('user_id is required')
    .not()
    .isEmpty()
    .withMessage('user_id must not be empty')
    .custom(async value=>{
        return new Promise((resolve, reject)=>{
            con.query('SELECT * FROM users WHERE user_id=?',[value], async(err,dbResult)=>{
                if(err){
                    
                    console.log(`UserId validator Database Error:${err.toString()}`)
                    return reject(new Error(`UserId validator Database Error:${err.toString()}`));
                    // throw new Error("Could not verify user")
                }
                console.log("dbResult",dbResult)
                console.log("dbResult ka type",typeof(dbResult))
                console.log("dbResult[0] ka length",dbResult.length)
                console.log("value",value)
                if(!dbResult || dbResult.length===0){
                    return reject(new Error("this userId does not belong to any user"));
                    // return false
                    // throw new Error("Could not verify user")
                }
                if(dbResult[0].user_id===value){
                    // return true;
                    resolve();
                }
                console.log(`Something went wrong`)
                // return false
                return reject(new Error("Something went wrong"));
                // throw new Error("Could not verify user")

            })
        })
        
    }),
    check('product_id').exists()
    .withMessage('product_id is required')
    .not()
    .isEmpty()
    .withMessage('product_id must not be empty')
    .custom(async value=>{
        return new Promise((resolve, reject)=>{
            con.query('SELECT * FROM products WHERE product_id=?',[value], async(err,dbResult)=>{
                if(err){
                    console.log(`product_id validator Error:${err.toString()}`)
    
                    return reject(new Error(`product_id validator Database Error:${err.toString()}`))
                }
                if(dbResult && dbResult.length>0){
                    if(dbResult[0].product_id===value){
                        return resolve()
                    }
                }
                console.log(`This product_id does not belong to any product`)
    
                return reject(new Error(`This product_id does not belong to any product`))
    
            })
        })
    }),
    check('quantity')
      .isInt({ min: 0 }).withMessage('quantity must not be empty and greather or equal to zero')
      .custom(async (value, { req }) => {
        const { product_id } = req.body;
        return new Promise((resolve, reject)=>{
            // Fetch product details from the database
            con.query('SELECT inventory_count FROM products WHERE product_id = ?',
            [product_id],async(err, dbResult)=>{
            if(err){
                console.log(`quantity validator Error1:${err.toString()}`)

                return reject(new Error(`quantity validator Database error:${err.toString()}`))
            }
            if(dbResult && dbResult.length>0){
                // Check if quantity is less than or equal to inventory_count
                if (value > dbResult[0].inventory_count) {
                    console.log(`quantity validator Error2`)

                    return reject(new Error(`Quantity Exceeds available inventory`))
                }
            }
            resolve();
            });
        })
        

        
      }),
      (req, res, next)=>{
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
            //   result.message = "Invalid " + str;
              result.message = " " + str;
              console.log("result.message",result.message)
              res.send(result);
          } else{
            next();
          }
      }
]

exports.removeFromCartValidator=[
    check('user_id').exists()
    .withMessage('user_id is required')
    .not()
    .isEmpty()
    .withMessage('user_id must not be empty')
    .custom(async value=>{
        return new Promise((resolve, reject)=>{
            con.query('SELECT * FROM users WHERE user_id=?',[value], async(err,dbResult)=>{
                if(err){
                    
                    console.log(`UserId validator Database Error:${err.toString()}`)
                    return reject(new Error(`UserId validator Database Error:${err.toString()}`));
                    // throw new Error("Could not verify user")
                }
                // console.log("dbResult",dbResult)
                // console.log("dbResult ka type",typeof(dbResult))
                // console.log("dbResult[0] ka length",dbResult.length)
                // console.log("value",value)
                if(!dbResult || dbResult.length===0){
                    return reject(new Error("this userId does not belong to any user"));
                    // return false
                    // throw new Error("Could not verify user")
                }
                if(dbResult[0].user_id===value){
                    // return true;
                    return resolve();
                }
                console.log(`Something went wrong`)
                // return false
                return reject(new Error("Something went wrong"));
                // throw new Error("Could not verify user")

            })
        })
        
    }),
    check('product_id').exists()
    .withMessage('product_id is required')
    .not()
    .isEmpty()
    .withMessage('product_id must not be empty')
    .custom(async value=>{
        return new Promise((resolve, reject)=>{
            con.query('SELECT * FROM products WHERE product_id=?',[value], async(err,dbResult)=>{
                if(err){
                    console.log(`product_id validator Error:${err.toString()}`)
    
                    return reject(new Error(`product_id validator Database Error:${err.toString()}`))
                }
                if(dbResult && dbResult.length>0){
                    if(dbResult[0].product_id===value){
                        return resolve()
                    }
                }
                console.log(`This product_id does not belong to any product`)
    
                return reject(new Error(`This product_id does not belong to any product`))
    
            })
        })
    }),
    (req, res, next)=>{
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
            //   result.message = "Invalid " + str;
              result.message = " " + str;
              console.log("result.message",result.message)
              res.send(result);
          } else{
            next();
          }
    }
]

