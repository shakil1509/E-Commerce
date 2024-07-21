const { validationResult } = require("express-validator");
const con = require("../database/mysqlCon");

CommonValidate = (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      const result = {
        status: false,
        statusCode: 400,
        message: "Invalid " + errors.map(error => error.param).join(' '),
      };
      res.send(result);
    } else {
      next();
    }
  };

exports.productCreation = async (req, res, next) => {
    var result = {};
    try {
            const { product_name, price, category_id, product_description } = req.body;
  
            con.query('INSERT INTO products (product_name, price, category_id, product_description) VALUES (?, ?, ?, ?)', [product_name, price, category_id, product_description], (err, results) => {
              if (err) {
                result.status = false;
                result.statusCode = 500;
                result.message = `Database Error:${err.toString()}`;
                res.send(result);
              }
              result.status = true;
              result.statusCode = 201;
              result.message = (`Products created successfully, product_id: ${results.insertId}`);
              result.data = results;
              res.send(result);
            });
    } catch (err) {
      result.status = false;
      result.statusCode = 400;
      result.message = err.toString();
      res.send(result);
    }  
}

exports.productBulkCreation = async (req, res, next) => {
    var result = {};
    try {
            const products = req.body.products;
            // console.log("Input Data",products)
            const values = products.map(product => [product.product_name, product.category_id, product.price, product.product_description]);
            // console.log("values",values);
            con.query('INSERT INTO products (product_name, category_id, price, product_description) VALUES ?', [values], (err, dbResults) => {
                if (err) {
                    result.status = false;
                    result.statusCode = 500;
                    result.message = `Database Error:${err.toString()}`;
                    res.send(result);
                }
                if (dbResults.affectedRows >= 1) {
                    result.status = true;
                    result.statusCode = 201;
                    result.message = (`${dbResults.affectedRows} Products created successfully`);
                    result.data = dbResults;
                    res.send(result);
                } else {
                    result.status = false;
                    result.statusCode = 500;
                    result.message = (`${dbResults.affectedRows} Products created successfully`);
                    result.data = dbResults;
                    res.send(result);
                }
            });
    } catch (err) {
        // console.log("inside catch error", err)
        result.status = false;
        result.statusCode = 400;
        result.message = err.toString();
        res.send(result);
    }
}

// 1. Filtering:
// Allow users to specify filters through query parameters.

// Example: http://your-api-base-url/products/by-category/:categoryId?filter=price&minPrice=50&maxPrice=100

// Implement logic in your API code to apply filters based on query parameters.

// 2. Pagination:
// Allow users to specify pagination parameters such as page (current page) and limit (items per page).

// Example: http://your-api-base-url/products/by-category/:categoryId?page=1&limit=10

// Implement logic to calculate the offset based on the page and limit parameters.

// Modify your database query to include LIMIT and OFFSET for pagination.

// Modified Example for Filtering and Pagination:
// URL: http://your-api-base-url/products/by-category/:categoryId?page=1&limit=10&filter=price&minPrice=50&maxPrice=100
// Method: GET

exports.fetchProducts = async (req, res, next) => {
    var result = {};
    con.query('SELECT * FROM products', (err, results) => {
        if (err) {
            result.status = false;
            result.statusCode = 500;
            result.message = `Database Error:${err.toString()}`;
            res.send(result);
        }
        result.status = true;
        result.statusCode = 200;
        result.data = results;
        res.send(result);
    })
}

exports.getProductsbyCategoryID = async (req, res, next) => {
    var result = {};
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    con.query('SELECT * FROM products WHERE category_id = ? LIMIT ? OFFSET ?',
    [categoryId, parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) {
            result.status = false;
            result.statusCode = 500;
            result.message = `Database Error:${err.toString()}`;
            res.send(result);
        }
        result.status = true;
        result.statusCode = 200;
        result.data = results;
        res.send(result);
    })
}

exports.productsSearch = async (req, res, next) => {
    var result = {};
    const { q } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    con.query('SELECT p.* FROM products p JOIN categories c ON p.category_id=c.category_id WHERE c.category_name LIKE ? OR p.product_name LIKE ? OR p.product_description LIKE ? LIMIT ? OFFSET ?',
    [`%${q}%`,`%${q}%`,`%${q}%`, parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) {
            result.status = false;
            result.statusCode = 500;
            result.message = `Database Error:${err.toString()}`;
            res.send(result);
        }
        result.status = true;
        result.statusCode = 200;
        result.data = results;
        res.send(result);
    })
}

exports.productUpdation = (req, res, next) => {
    var result = {};
    try {
        let str = "";
        const errors = validationResult(req).array();
        if (errors.length > 0) {
            result.status = false;
            result.statusCode = 400;
            for (let i = 0; i < errors.length; i++) {
                str += errors[i].param + " ";
            }
            result.message = "Invalid " + str;
            //result.message = errors
            res.send(result);
        }

        const product_id = req.params['id'];
        console.log("req.params>>>>>>", req.params);

        console.log("product_id>>>>>>", product_id);
        const { product_name, price, category_id, product_description } = req.body;
        console.log("product_name>>>>>>", product_name);
        con.query('UPDATE products SET product_name=?, price=?, category_id=?, product_description=? WHERE product_id=?', [product_name, price, category_id, product_description], (err, results) => {
            if (err) {
                result.status = false;
                result.statusCode = 500;
                result.message = `Database Error:${err.toString()}`;
                res.send(result);
            }
            result.status = true;
            result.statusCode = 200;
            result.message = ("Updation successful");
            result.data = results;
            res.send(result);
        })
    } catch (err) {
        result.status = false;
        result.statusCode = 400;
        result.message = err.toString();
        res.send(result);
    }
}

// exports.productBulkUpdation =(req, res, next) =>{
//     var result={};
//     try{
//         let str = "";
//         const errors = validationResult(req).array();
//         if (errors.length > 0) {
//             result.status = false;
//             result.statusCode = 400;
//             for (let i = 0; i < errors.length; i++) {
//                 str += errors[i].param + " ";
//             }
//             result.message = "Invalid " + str;
//             //result.message = errors
//             res.send(result);
//         }

//         const products = req.body.products;
//     console.log("products>>>>>>",products);
//     const values = products.map(product => [product.product_name, product.category_id, product.price, product.product_description, product.id]);
//     con.query('UPDATE products SET product_name=?, price=?, category_id=?, product_description=? WHERE product_id=?',[product_name, price, category_id, product_description],(err, results)=>{
//         if(err){
//             result.status = false;
//             result.statusCode = 500;
//             result.message = `Database Error:${err.toString()}`;
//             res.send(result);
//         }
//         result.status=true;
//         result.statusCode=200;
//         result.message=("Updation successful");
//         result.data=results;
//         res.send(result);
//     })
//     } catch(err){
//         result.status = false;
//         result.statusCode = 400;
//         result.message = err.toString();
//         res.send(result);
//     }
// }


exports.productDeletion = (req, res, next) => {
    var result = {};
    const product_id = req.params['id'];
    console.log("req.params>>>>>>", req.params);

    con.query('DELETE FROM categories WHERE product_id = ?', [product_id], (err, results) => {
        if (err) {
            result.status = false;
            result.statusCode = 500;
            result.message = `Database Error:${err.toString()}`;
            res.send(result);
        }
        result.status = true;
        result.statusCode = 200;
        result.message = ("Product Deletion successful");
        result.data = results;
        res.send(result);
    })
}

exports.productBulkDeletion = (req, res, next) => {
    var result = {};
    const productIds = req.body.productIds;
    console.log("productIds",productIds);
    console.log("Type of",typeof(productIds));
    const formattedString = `(${productIds.join(', ')})`;

    console.log(formattedString);
    console.log("Type of",typeof(formattedString));

    try {
        // Create a string with the same number of "?" as the length of the productIds array
        const placeholders = productIds.map(() => '?').join(', ');

        // Construct the query with the placeholders
        const query = `DELETE FROM products WHERE product_id IN (${placeholders})`;
        con.query(query, productIds,(err, dbResults)=>{
            if (err) {
                result.status = false;
                result.statusCode = 500;
                result.message = `Database Error:${err.toString()}`;
                res.send(result);
            }
            if (dbResults.affectedRows > 0) {
                result.status = true;
                result.statusCode = 200;
                result.message = (`${dbResults.affectedRows} Product Deleted successfully`);
                result.data = dbResults;
                res.send(result);
            } else {
                result.status = false;
                result.statusCode = 404;
                result.message = 'No products found for deletion';
                res.send(result);
            }
        });

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}