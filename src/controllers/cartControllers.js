const con = require("../database/mysqlCon");



exports.addToCart = async (req, res, next) => {
    var result = {};
    try {
            const { user_id, product_id, quantity } = req.body;

            // Check if quantity is zero, remove the item from the cart
            if(quantity===0){
                con.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [user_id, product_id],async(err, dbResult)=>{
                    if(err){
                        console.log("1")
                        result.status = false;
                        result.statusCode = 500;
                        result.message = `Database Error1:${err.toString()}`;
                        res.send(result);
                    }
                    if(dbResult && dbResult.length>0){
                        if(dbResult.affectedRows===1){
                            console.log("2")
    
                            result.status = true;
                            result.statusCode = 201;
                            result.message = (`Item Removed successfully from cart`);
                            result.data = results;
                            res.send(result);
                        }
                    }
                    else{
                        console.log("3")

                        result.status = false;
                        result.statusCode = 500;
                        result.message = `Database Error2:${err.toString()}`;
                        res.send(result);
                    }
                })
            }
            else{
                // Check if the item is already in the cart
                con.query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [
                    user_id,
                    product_id,
                  ],async(err, dbResult)=>{
                    if(err){
                        console.log("4")

                        result.status = false;
                        result.statusCode = 500;
                        result.message = `Database Error1:${err.toString()}`;
                        res.send(result);
                    }
                    if(dbResult.length>0){
                        console.log("5")

                        // Update the quantity if the item is already in the cart
                        con.query('UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?', [
                            dbResult[0].quantity + quantity,
                            user_id,
                            product_id,
                          ],(err, dbResult2)=>{

                            if(err){
                                console.log("6")

                                result.status = false;
                                result.statusCode = 500;
                                result.message = `Database Error:${err.toString()}`;
                                res.send(result);
                            }
                            if(dbResult2.affectedRows===1){
                        console.log("7")

                                result.status = true;
                                result.statusCode = 201;
                                result.message = (`Item Added successfully to cart`);
                                result.data = dbResult2;
                                res.send(result);
                            }
                          })
                    }else{
                        console.log("8")

                        // Add the item to the cart if it's not already present
                        con.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [
                            user_id,
                            product_id,
                            quantity,
                          ],async(err,dbResult3)=>{
                            if(err){
                        console.log("9")

                                result.status = false;
                                result.statusCode = 500;
                                result.message = `Database Error:${err.toString()}`;
                                res.send(result);
                            }
                            if(dbResult3.affectedRows===1){
                        console.log("10")

                                result.status = true;
                                result.statusCode = 201;
                                result.message = (`Item Added successfully to cart`);
                                result.data = dbResult3;
                                res.send(result);
                            }else{
                        console.log("11")

                                result.status = false;
                                result.statusCode = 500;
                                result.message = `Database Error2:${err.toString()}`;
                                res.send(result);
                            }
                          });
                    }
                });
            }
  
    } catch (err) {
        console.log("12")

      result.status = false;
      result.statusCode = 400;
      result.message = err.toString();
      res.send(result);
    }  
}

exports.removeFromCart=async(req, res, next)=>{
    var result={}
    try{
        const { user_id, product_id } = req.body;
        // Remove the product from the cart
        con.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [user_id, product_id],(err,dbResult)=>{
            console.log("dbResult from delete",dbResult);
            if(err){
                result.status = false;
                result.statusCode = 500;
                result.message = `Could not Remove Item from the cart Database Error:${err.toString()}`;
                res.send(result);
            }
            if(dbResult){
                if(dbResult.affectedRows===1){
                    console.log("2")

                    result.status = true;
                    result.statusCode = 201;
                    result.message = (`Item Removed successfully from cart`);
                    result.data = dbResult;
                    res.send(result);
                } else{
                    result.status = false;
                    result.statusCode = 400;
                    result.message = "There is no item in the cart to remove";
                    res.send(result);
                }
            } 
            else{
                result.status = false;
                result.statusCode = 500;
                result.message = `Could not Remove Item from the cart`;
                res.send(result);
            }
        });

    } catch(err){
        result.status = false;
        result.statusCode = 400;
        result.message = `Unable to Remove Item from the cart ${err.toString()}`;
        res.send(result);
    }
}
// exports.addToCart = async (req, res, next) => {
//     var result = {};
//     try {
//             const { user_id, product_id, quantity } = req.body;

//             // Check if quantity is zero, remove the item from the cart
//             if(quantity===0){
//                 con.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [user_id, product_id],async(err, dbResult)=>{
//                     if(err){
//                         console.log("1")
//                         result.status = false;
//                         result.statusCode = 500;
//                         result.message = `Database Error1:${err.toString()}`;
//                         res.send(result);
//                     }
//                     if(dbResult.affectedRows===1){
//                         console.log("2")

//                         result.status = true;
//                         result.statusCode = 201;
//                         result.message = (`Item Removed successfully from cart`);
//                         result.data = results;
//                         res.send(result);
//                     }else{
//                         console.log("3")

//                         result.status = false;
//                         result.statusCode = 500;
//                         result.message = `Database Error2:${err.toString()}`;
//                         res.send(result);
//                     }
//                 })
//             }
//             else{
//                 // Check if the item is already in the cart
//                 con.query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [
//                     user_id,
//                     product_id,
//                   ],async(err, dbResult)=>{
//                     if(err){
//                         console.log("4")

//                         result.status = false;
//                         result.statusCode = 500;
//                         result.message = `Database Error1:${err.toString()}`;
//                         res.send(result);
//                     }
//                     if(dbResult.length>0){
//                         console.log("5")

//                         // Update the quantity if the item is already in the cart
//                         con.query('UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?', [
//                             dbResult[0].quantity + quantity,
//                             user_id,
//                             product_id,
//                           ],(err, dbResult2)=>{

//                             if(err){
//                         console.log("6")

//                                 result.status = false;
//                                 result.statusCode = 500;
//                                 result.message = `Database Error:${err.toString()}`;
//                                 res.send(result);
//                             }
//                             if(dbResult2.Changed==1){
//                         console.log("7")

//                                 result.status = true;
//                                 result.statusCode = 201;
//                                 result.message = (`Item Added successfully to cart`);
//                                 result.data = results;
//                                 res.send(result);
//                             }
//                           })
//                     }else{
//                         console.log("8")

//                         // Add the item to the cart if it's not already present
//                         con.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [
//                             user_id,
//                             product_id,
//                             quantity,
//                           ],async(err,dbResult3)=>{
//                             if(err){
//                         console.log("9")

//                                 result.status = false;
//                                 result.statusCode = 500;
//                                 result.message = `Database Error:${err.toString()}`;
//                                 res.send(result);
//                             }
//                             if(dbResult3.affectedRows===1){
//                         console.log("10")

//                                 result.status = true;
//                                 result.statusCode = 201;
//                                 result.message = (`Item Added successfully to cart`);
//                                 result.data = dbResult3;
//                                 res.send(result);
//                             }else{
//                         console.log("11")

//                                 result.status = false;
//                                 result.statusCode = 500;
//                                 result.message = `Database Error2:${err.toString()}`;
//                                 res.send(result);
//                             }
//                           });
//                     }
//                 });
//             }
  
//     } catch (err) {
//         console.log("12")

//       result.status = false;
//       result.statusCode = 400;
//       result.message = err.toString();
//       res.send(result);
//     }  
// }