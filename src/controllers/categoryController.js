const { validationResult } = require("express-validator");
const con = require("../database/mysqlCon");
const {setRedis, setExRedis, getRedis}=require('../database/redisFunctionality');

setExRedis('book1','Node js design patterns1',20)



exports.categoryCreation=async(req, res, next)=>{
    var result = {};

    try{
            const { category_name } = req.body;
            con.query('INSERT INTO categories (category_name) VALUES (?)', [category_name], (err, results) =>{
                if(err){
                    result.status = false;
                    result.statusCode = 500;
                    result.message = `Database Error:${err.toString()}`;
                    res.send(result);
                }
                result.status=true;
                result.statusCode=201;
                result.message=(`Category created successfully , category_id: ${results.insertId}`);
                result.data=results;
                res.send(result);
            })
    } catch (err) {
        console.log("inside catch error", err)
        result.status = false;
        result.statusCode = 400;
        result.message = err.toString();
        res.send(result);
    }
}


// const redisKey = 'categories';

// exports.fetchCategories = async (req, res, next) => {
//     console.log("control is here6")

//   const result = {};
//   const redisKey = 'categories';

//   // Check if data is cached in Redis
//   client.get(redisKey, async (err, cachedData) => {
//     if (err) {
//         console.log("control is here5")

//       console.error(`Redis Error: ${err}`);
//     }

//     if (cachedData) {
//         console.log("control is here4")

//       // If cached data exists, send it as the response
//       const parsedData = JSON.parse(cachedData);
//       result.status = true;
//       result.statusCode = 200;
//       result.data = parsedData;
//       res.send(result);
//     } else {
//         console.log("control is here1")
//       // If no cached data, query the database
//       con.query('SELECT * FROM categories', (dbError, results) => {
//         if (dbError) {
//         console.log("control is here2")

//           result.status = false;
//           result.statusCode = 500;
//           result.message = `Database Error: ${dbError.toString()}`;
//           res.send(result);
//         } else {
//         console.log("control is here3")

//           // Cache the data in Redis for future use
//           client.setEx(redisKey, 3600, JSON.stringify(results)); // Cache for 1 hour
//           result.status = true;
//           result.statusCode = 200;
//           result.data = results;
//           res.send(result);
//         }
//       });
//     }
//   });
// };


//Original
// exports.fetchCategories=async(req, res, next)=>{
//     var result = {};
//     const curr=Date.now()
//     con.query('SELECT * FROM categories', (err, results) =>{
//         if(err){
//             result.status = false;
//             result.statusCode = 500;
//             result.message = `Database Error:${err.toString()}`;
//             res.send(result);
//         }
//         const responseTime=Date.now()-curr;
//         console.log("Response time from db", responseTime);
//         result.status=true;
//         result.statusCode=200;
//         result.data=results;
//         res.send(result);
//     })
// }


//ioredis
// exports.fetchCategories=async(req, res, next)=>{
//     var result = {};
//     const key ='categories';
//     const redisResult=await getRedis(key);
//     if(redisResult){
//         result.status=true;
//         result.statusCode=200;
//         result.data=JSON.parse(redisResult);
//         res.send(result);
//     }
//     const curr=Date.now()
//     con.query('SELECT * FROM categories', async (err, results) =>{
//         if(err){
//             result.status = false;
//             result.statusCode = 500;
//             result.message = `Database Error:${err.toString()}`;
//             res.send(result);
//         }
//         const responseTime=Date.now()-curr;
//         console.log("Response time from db", responseTime);
//         await setExRedis(key, JSON.stringify(results), 20)
//         result.status=true;
//         result.statusCode=200;
//         result.data=results;
//         res.send(result);
//     })
// }

exports.fetchCategories = async (req, res, next) => {
    var result = {};
    const key = 'categories';
    const redisResult = await getRedis(key);
  
    if (redisResult) {
      result.status = true;
      result.statusCode = 200;
      result.data = JSON.parse(redisResult);
      res.send(result);
    } else {
      const curr = Date.now();
  
      con.query('SELECT * FROM categories', async (err, results) => {
        if (err) {
          result.status = false;
          result.statusCode = 500;
          result.message = `Database Error:${err.toString()}`;
        } else {
          const responseTime = Date.now() - curr;
          console.log("Response time from db", responseTime);
          await setExRedis(key, JSON.stringify(results), 900);
  
          result.status = true;
          result.statusCode = 200;
          result.data = results;
        }
  
        // Send the response outside of if-else blocks
        res.send(result);
      });
    }
  };



exports.categoryUpdation =(req, res, next) =>{
    var result={};
    try{
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

    const category_id=req.params['id'];
    console.log("req.params>>>>>>",req.params);

    console.log("category_id>>>>>>",category_id);
    const {category_name}=req.body;
    console.log("category_name>>>>>>",category_name);
    con.query('UPDATE categories SET category_name = ? WHERE category_id = ?',[category_name, category_id],(err, results)=>{
        if(err){
            result.status = false;
            result.statusCode = 500;
            result.message = `Database Error:${err.toString()}`;
            res.send(result);
        }
        result.status=true;
        result.statusCode=200;
        result.message=("Updation successful");
        result.data=results;
        res.send(result);
    })
    } catch(err){
        result.status = false;
        result.statusCode = 400;
        result.message = err.toString();
        res.send(result);
    }
}

exports.categoryDeletion =(req, res, next) =>{
    var result={};
    const category_id=req.params['id'];
    console.log("req.params>>>>>>",req.params);

    con.query('DELETE FROM categories WHERE category_id = ?',[category_id],(err, results)=>{
        if(err){
            result.status = false;
            result.statusCode = 500;
            result.message = `Database Error:${err.toString()}`;
            res.send(result);
        }
        result.status=true;
        result.statusCode=200;
        result.message=("Deletion successful");
        result.data=results;
        res.send(result);
    })
}