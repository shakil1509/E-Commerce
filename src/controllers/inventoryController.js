const con = require("../database/mysqlCon");

exports.getInventoryCount=async(req, res, next)=>{
    var result = {};

    try{
        const {product_id}=req.body;
        con.query('SELECT * FROM inventory WHERE product_id=?',[product_id], (err, dbResult) =>{
            if(err){
                result.status = false;
                result.statusCode = 500;
                result.message = `Could Not fetch data Database Error:${err.toString()}`;
                res.send(result);
            }
            console.log("dbResult Cart",dbResult);
            console.log("dbResult[0] Cart",dbResult[0]);
            console.log("dbResult type of Cart",typeof(dbResult));

            result.status=true;
            result.statusCode=200;
            result.data=dbResult;
            res.send(result);
        })
    }
    catch(err){
        result.status = false;
        result.statusCode = 400;
        result.message = err.toString();
        res.send(result);
    }
   
}

exports.updateInventoryCount=async(req, res, next)=>{
    var result = {};

    try{
        const {product_id}=req.body;
        const {inventory_count}=req.body;
        con.query('INSERT INTO inventory (product_id, Inventory_count) VALUES (?, ?) ON DUPLICATE KEY UPDATE Inventory_count = ?;',[product_id,inventory_count,inventory_count], (err, dbResult) =>{
            if(err){
                result.status = false;
                result.statusCode = 500;
                result.message = `Could Not fetch data Database Error:${err.toString()}`;
                res.send(result);
            }
            console.log("dbResult Cart",dbResult);
            console.log("dbResult[0] Cart",dbResult[0]);
            console.log("dbResult type of Cart",typeof(dbResult));
            if(dbResult){
                if(dbResult.affectedRows>=1){
                    result.status=true;
                    result.statusCode=200;
                    result.data=dbResult;
                    res.send(result);
                }
            }
        })
    }
    catch(err){
        result.status = false;
        result.statusCode = 400;
        result.message = err.toString();
        res.send(result);
    }
   
}