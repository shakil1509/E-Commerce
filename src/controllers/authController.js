const { validationResult } = require("express-validator");
var bcrypt = require('bcrypt');
const con = require("../database/mysqlCon");
const authValidator=require('../middlewares/validator');
const jwt = require('jsonwebtoken');


exports.signUp = async (req, res, next) => {
    console.log("control is in signUp", req.body)
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
        } else {
            // Extract user data from the request body
            const { username, email, phone, password, first_name, last_name, date_of_birth } = req.body;

            // Hash the password before storing it in the database (using bcrypt, for example)
            // Note: You should replace 'your_bcrypt_salt_rounds' with an appropriate value
            // See: https://www.npmjs.com/package/bcrypt#usage
            const hashedPassword = bcrypt.hashSync(password, 8);
            con.query('INSERT INTO users(username, email, phone, password,first_name,last_name,date_of_birth) VALUES(?,?,?,?,?,?,?)', [username, email, phone, hashedPassword, first_name, last_name, date_of_birth], (err, results) => {
                if (err) {
                    console.log("database error>>>>", err);
                    result.status = false;
                    result.statusCode = 500;
                    result.message = "database error"
                    res.send(result);
                }
                result.status = true;
                result.statusCode = 200;
                result.message = "Registration successfull";
                result.data = results;
                return res.send(result)
            })

        }
    } catch (err) {
        result.status = false;
        result.statusCode = 400;
        result.message = err.toString();
        res.send(result);
    }
}

exports.login = async (req, res, next) => {
    console.log("inside login >>>>", req.body)
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
        else {
            // Extract login data from the request body
            const { identifier, password } = req.body;

            // Determine if the identifier is an email or phone
            const isEmail = identifier.includes('@');

            // Check if the user exists based on email or phone
            let userExists;
            if (isEmail) {
                userExists = await authValidator.emailExists(identifier);
            } else {
                userExists = await authValidator.phoneExists(identifier);
            }
            if (!userExists) {
                result.status = false;
                result.statusCode = 400;
                result.message = "User does not exist";
                res.send(result);
            }
            // Fetch user data from the database
            const columnName = isEmail ? 'email' : 'phone';
            con.query(`SELECT * FROM users WHERE ${columnName}=?`, [identifier], async (err, results) => {
                if (err) {
                    result.status = false;
                    result.statusCode = 500;
                    result.message = "Database Error";
                    res.send(result);
                }
                const user = results[0];

                // Compare the provided password with the hashed password in the database
                bcrypt.compare(password, user.password, (err, passwordMatch) => {
                    if (err) {
                        result.status = false;
                        result.statusCode = 500;
                        result.message = "Error comparing the password";
                        res.send(result);
                    }
                    if (!passwordMatch) {
                        result.status = false;
                        result.statusCode = 400;
                        result.message = "Invalid credentials";
                        res.send(result);
                    }
                    // If the password is correct, generate a JWT token
                    const token = jwt.sign({ userId: user.user_id, username: user.username,is_admin: user.is_admin }, 'MySecretKey', { expiresIn: '1h' });
                    // const token = jwt.sign({ userId: user.userId, is_admin: user.is_admin }, 'MySecretKey', { expiresIn: '1h' });
                    result.status = true;
                    result.statusCode = 200;
                    result.message = "Login Successfully";
                    result.token = token;
                    res.send(result);
                })
            })
        }
    } catch (err) {
        console.log("inside catch error", err)
        result.status = false;
        result.statusCode = 400;
        result.message = err.toString();
        res.send(result);
    }
}

exports.extractUserDetails= async (req, res) => {
    var result={}
    const userId = req.userDetails.userId;
  
    con.query('SELECT user_id, username, email, phone, first_name, last_name, date_of_birth FROM users WHERE user_id = ?', [userId], (err, results) => {
      if (err) {
        result.status = false;
        result.statusCode = 500;
        result.message = `Database Error:${err.toString()}`;
        res.send(result);
      }
  
      if (results.length === 0) {
        result.status = false;
        result.statusCode = 404;
        result.message = "User not found";
        res.send(result);
      }
  
      const user = results[0];
      result.status=true;
      result.statusCode=200;
      result.data=user;
      res.send(result);
    });
  }

  exports.changePassword=(req, res, next)=>{
    var result = {};
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
        } else {
            const { oldPassword, newPassword } = req.body;
            const userId=req.userDetails.userId;
             // Fetch the current hashed password from the database
            con.query('SELECT password FROM users WHERE user_id = ?', [userId], (err, results) =>{
                if(err){
                    result.status = false;
                    result.statusCode = 500;
                    result.message = `Database Error:${err.toString()}`;
                    res.send(result);
                }
                if (results.length === 0) {
                    result.status = false;
                    result.statusCode = 404;
                    result.message = "User not found";
                    res.send(result);
                }
                const hashedPassword = results[0].password;
                // Compare the old password with the hashed password in the database
                bcrypt.compare(oldPassword, hashedPassword, (err, passwordMatch) =>{
                    if(err){
                        result.status = false;
                        result.statusCode = 500;
                        result.message = "Internal server error";
                        res.send(result);
                    }
                    if(!passwordMatch){
                        result.status = false;
                        result.statusCode = 401;
                        result.message = "Invalid old password";
                        res.send(result);
                    }
                    // Hash the new password before updating it in the database
                    const newHashedPassword = bcrypt.hashSync(newPassword, 8);

                    // Update the password in the database
                    con.query('UPDATE users SET password = ? WHERE user_id = ?', [newHashedPassword, userId], (err, results) =>{
                        if(err){
                            result.status = false;
                            result.statusCode = 500;
                            result.message = "Internal server error";
                            res.send(result);
                        }
                        result.status=true;
                        result.statusCode=200;
                        result.message="Password updated Successfully";
                        res.send(result);
                    })
                })

            })

        }
    } catch(err){
        result.status = false;
        result.statusCode = 400;
        result.message = err.toString();
        res.send(result);
    }

  }
