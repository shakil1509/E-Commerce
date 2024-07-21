const mysql=require('mysql');
require('dotenv').config();
const HOST=process.env.host;
const USER=process.env.user;
const PASSWORD=process.env.password;
const DATABASE=process.env.database;
console.log("process.env:",process.env.host);
console.log("process.env:",process.env.PORT);

console.log("process.env:",process.env.user);
console.log("process.env:",process.env.password);
console.log("process.env:",process.env.database);

// const con= mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'shakil1607',
//     database:'e_commerceDB'
// })
const con= mysql.createConnection({
    host:HOST,
    user:USER,
    password:PASSWORD,
    database:DATABASE
})


con.connect((err)=>{
    if(err){
        console.log("MySQL Connection Error",err);
    }
    else{
        console.log("Connected to MySQL Database successfully");
    }
})

module.exports=con;