const con = require("../database/mysqlCon");
const {v4 : uuidv4} = require('uuid')

// Function to get the price of a product from the database
const getProductPrice = (productId) => {
    return new Promise((resolve, reject) => {
      con.query('SELECT price FROM products WHERE product_id = ?', [productId], (err, results) => {
        if (err) {
          reject(`Error fetching product price: ${err.toString()}`);
        } else if (results.length === 0) {
          reject(`Product with ID ${productId} not found.`);
        } else {
          resolve(results[0].price);
        }
      });
    });
};

// Function to decrease the quantity of a product from the database
const decreaseInventoryQuantity = (productId, quantity) => {
    return new Promise((resolve, reject) => {
      con.query('UPDATE inventory SET inventory_count = inventory_count - ? WHERE product_id = ?', [quantity, productId], (err, results) => {
        if (err) {
          reject(`Error updating inventory quantity: ${err.toString()}`);
        } else if (results.affectedRows === 0) {
          reject(`Product with ID ${productId} not found.`);
        } else {
          resolve();
        }
      });
    });
  };

// Function to insert a record into the orders table
const insertOrderRecord = (user_id, order_id, product_id, quantity, price) => {
    return new Promise((resolve, reject) => {
      con.query('INSERT INTO orders (user_id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [user_id, order_id, product_id, quantity, price],
        (err) => {
          if (err) {
            reject(`Error inserting order record: ${err.toString()}`);
          } else {
            resolve();
          }
        });
    });
};
// Function to delete an item from the cart
const deleteCartItem = (user_id, product_id) => {
    return new Promise((resolve, reject) => {
      con.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [user_id, product_id], (err, results) => {
        if (err) {
          reject(`Error deleting cart item: ${err.toString()}`);
        } else if (results.affectedRows !== 1) {
          reject(`Cart item not found for user ${user_id} and product ${product_id}`);
        } else {
          resolve();
        }
      });
    });
};
  
// Implement your own function to generate a unique order ID
  const generateOrderId = () => {
    // Your implementation here
    // Generate a v4 (random) UUID
    const fullUuid = uuidv4();
  
    // Take the first 6 characters to create a short ID
    const shortId = fullUuid.substring(0, 6).toUpperCase();
  
    return shortId;
};

exports.createOrder=(req, res, next)=>{
  var result = {};
  const { user_id, cartItems } = req.body;
  const order_id = generateOrderId();

  try{
      // Start a database transaction
      con.beginTransaction(async (err)=>{
          if(err){
              throw new Error(`Error starting transaction: ${err.toString()}`);
          }
          try{
              // Iterate through cart items
              for(const cartItem of cartItems){
                  const {product_id, quantity}=cartItem;
                  console.log("inside 1st try inside transaction product_id",product_id);
                  console.log("inside 1st try inside transaction quantity",quantity);

                  //fetch the product price
                  const price=await getProductPrice(product_id);
                  console.log("inside 1st try inside transaction price",price);


                  //calculating total price for the item
                  const total_price=price * quantity;
                  console.log("inside 1st try inside transaction total_price",total_price);


                  //Inserting the order records to the order table       
                  await insertOrderRecord(user_id, order_id, product_id, quantity, price);
                  console.log("inside 1st try inside transaction after insertOrderRecord");
                  

                  //Decreasing the quantity of item purchased
                  await decreaseInventoryQuantity(product_id, quantity);
                  console.log("inside 1st try inside transaction after decreaseInventoryQuantity");


                  // Delete the item from the cart
                  await deleteCartItem(user_id, product_id);
                  console.log("inside 1st try inside transaction after deleteCartItem");
              }
              // Committing the transaction if all operations are successful
              con.commit((commitError)=>{
                  if (commitError) {
                      console.log("inside 1st try inside transaction inside commitError");

                      throw new Error(`Error committing transaction: ${commitError.toString()}`);
                  }
                  result.status = true;
                  result.statusCode = 201;
                  result.message = `Order placed successfully! your Order Id is: ${order_id}`;
                  return res.send(result);
              })
          }
          catch(rollbackError){
              // Rollback the transaction if any error occurs
              con.rollback((rollbackErr) => {
              if (rollbackErr) {
              console.error(`Error occured while rolling back transaction: ${rollbackErr.toString()}`);
              result.status = false;
              result.statusCode = 500;
              result.message =`Error occured while rolling back transaction: ${rollbackErr.toString()}`;
              return res.send(result);
              }
              result.status = false;
              result.statusCode = 500;
              // result.message = rollbackError ? `Error rolling back transaction: ${rollbackError.toString()}` : 'Error rolling back transaction.';
              result.message =`rolling back transaction: ${rollbackError.toString()}`;
              return res.send(result);
              });
          }
      })
  }
  catch(err){
      result.status = false;
      result.statusCode = 400;
      console.log(`inside catch block of createOrder Error:${err.toString()}`);
      result.message = err.toString();
      res.send(result);
  }
}
  

// exports.createOrder=(req, res, next)=>{
//     var result = {};
//     const { user_id, cartItems } = req.body;
//     const order_id = generateOrderId();

//     try{
//         // Start a database transaction
//         con.beginTransaction(async (err)=>{
//             if(err){
//                 throw new Error(`Error starting transaction: ${err.toString()}`);
//             }
//             try{
//                 // Iterate through cart items
//                 for(const cartItem of cartItem){
//                     const {product_id, quantity}=cartItem;
//                     console.log("inside 1st try inside transaction product_id",product_id);
//                     console.log("inside 1st try inside transaction quantity",quantity);

//                     //fetch the product price
//                     const price=await getProductPrice(product_id);
//                     console.log("inside 1st try inside transaction price",price);


//                     //calculating total price for the item
//                     const total_price=price * quantity;
//                     console.log("inside 1st try inside transaction total_price",total_price);


//                     //Inserting the order records to the order table
//                     await insertOrderRecord(order_id, user_id, product_id, quantity, price);
//                     console.log("inside 1st try inside transaction after insertOrderRecord");
                    

//                     //Decreasing the quantity of item purchased
//                     await decreaseInventoryQuantity(product_id, quantity);
//                     console.log("inside 1st try inside transaction after decreaseInventoryQuantity");


//                     // Delete the item from the cart
//                     await deleteCartItem(user_id, product_id);
//                     console.log("inside 1st try inside transaction after deleteCartItem");
//                 }
//                 // Committing the transaction if all operations are successful
//                 con.commit((commitError)=>{
//                     if (commitError) {
//                         console.log("inside 1st try inside transaction inside commitError");

//                         throw new Error(`Error committing transaction: ${commitError.toString()}`);
//                     }
//                     result.status = true;
//                     result.statusCode = 201;
//                     result.message = `Order placed successfully! your Order Id is: ${order_id}`;
//                     return res.send(result);
//                 })
//             }
//             catch(rollbackErr){
//                 // Rollback the transaction if any error occurs
//                 con.rollback((rollbackErr) => {
//                 if (rollbackErr) {
//                 console.error(`Error rolling back transaction: ${rollbackErr.toString()}`);
//                 }
//                 result.status = false;
//                 result.statusCode = 500;
//                 result.message = `Error rolling back transaction: ${rollbackErr.toString()}`
//                 return res.send(result);
//                 });
//             }
//         })
//     }
//     catch(err){
//         result.status = false;
//         result.statusCode = 400;
//         console.log(`inside catch block of createOrder Error:${err.toString()}`);
//         result.message = err.toString();
//         res.send(result);
//     }
// }


// exports.createOrder=(req, res, next)=>{
//     var result = {};

//     try{
//         const { user_id, cartItems } = req.body;
//         console.log("user_id",user_id);
//         console.log("cartItems",cartItems);


//         // Initialize an empty array to store processed cart items
//         const processedCartItems = [];

//         // Loop through each cart item
//         cartItems.forEach((item) => {
//         // Access individual properties of each cart item
//         const { product_id, quantity } = item;

//         // Perform any processing or manipulation here
//         // For example, you can create a new object with modified data
//         const processedItem = {
//         product_id,
//         quantity,
//         // Add any additional properties or modifications
//         };

//         // Push the processed item to the array
//         processedCartItems.push(processedItem);
//         });
//         const cartData={
//             user_id:user_id,
//             cartItems:processedCartItems
//         }
//         result.status = true;
//         result.statusCode = 200;
//         // console.log(`inside catch block of createOrder Error:${err.toString()}`);
//         result.data = cartData;
//         res.send(result);
//     }
//     catch(err){
//         result.status = false;
//         result.statusCode = 400;
//         console.log(`inside catch block of createOrder Error:${err.toString()}`);
//         result.message = err.toString();
//         res.send(result);
//     }
// }