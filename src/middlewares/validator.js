const { check, validationResult } = require('express-validator');
const con=require('../database/mysqlCon');
const jwt = require('jsonwebtoken');
// Custom validator function to check if the email already exists
const emailExists = async (email) => {
    return new Promise((resolve, reject) => {
        con.query('SELECT COUNT(*) as count FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
          reject(new Error('Database error'));
        } else {
          resolve(results[0].count > 0);
        }
      });
    });
  };
  const phoneExists = async (phone) => {
    return new Promise((resolve, reject) => {
        con.query('SELECT COUNT(*) as count FROM users WHERE phone = ?', [phone], (err, results) => {
        if (err) {
          reject(new Error('Database error'));
        } else {
          resolve(results[0].count > 0);
        }
      });
    });
  };

exports.emailExists = async (email) => {
    return new Promise((resolve, reject) => {
        con.query('SELECT COUNT(*) as count FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
          reject(new Error('Database error'));
        } else {
          resolve(results[0].count > 0);
        }
      });
    });
  };
exports.phoneExists = async (phone) => {
    return new Promise((resolve, reject) => {
        con.query('SELECT COUNT(*) as count FROM users WHERE phone = ?', [phone], (err, results) => {
        if (err) {
          reject(new Error('Database error'));
        } else {
          resolve(results[0].count > 0);
        }
      });
    });
  };

exports.registrationValidator= async(req, res, next)=>{
     // Validate username
     console.log("control is in Registrationvalidator",req.body)
  check('username').isLength({ min: 1, max: 50 }).withMessage('Username is required and must be at most 50 characters'),

  // Validate email
  check('email').isEmail().withMessage('Invalid email address').custom(email => {
    return emailExists(email).then(exists => {
      if (exists) {
        throw new Error('Email already exists');
      }
    });
  }),

  // Validate phone
  check('phone').isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits').custom(phone => {
    return phoneExists(phone).then(exists => {
      if (exists) {
        throw new Error('phone already exists');
      }
    });
  }),

  // Validate password
  check('password').isLength({ min: 1, max: 255 }).withMessage('Password is required'),

  // Validate first name
  check('first_name').isLength({ max: 50 }).withMessage('First name must be at most 50 characters'),

  // Validate last name
  check('last_name').isLength({ max: 50 }).withMessage('Last name must be at most 50 characters'),

  // Validate date of birth
  check('date_of_birth').isDate().withMessage('Invalid date of birth')

  // Handle registration date and is_admin separately as they are automatically set by the database
  next()

}

exports.passwordValidator=async(req, res, next)=>{
  check('oldPassword').isLength({ min: 1 }).withMessage('Old password is required'),
  check('newPassword').isLength({ min: 1 }).withMessage('New password is required')
  next();
}

exports.loginValidator=async(req, res, next)=>{
    // Validate email or phone
   check('identifier').isLength({ min: 1 }).withMessage('Email or phone is required'),

   // Validate password
   check('password').isLength({ min: 1 }).withMessage('Password is required')

   next()
}

//admin check middleware
exports.checkAdminMiddleware=(req, res, next)=>{
    var result={}
    const token = req.headers.authorization && req.headers.authorization.split(' ')[0];
    if(!token){
        console.log("inside checkAdmin middleware")
        result.status = false;
        result.statusCode = 401;
        result.message = "Unauthorized: Token not provided";
        res.send(result);
    }
    jwt.verify(token, 'MySecretKey', (err,decoded)=>{
        if(err){
            result.status = false;
            result.statusCode = 401;
            result.message = "Unauthorized: Invalid Token";
            res.send(result);
        }

        //check if the user is admin
        if(decoded.is_admin){
            req.user=decoded //make the user information available
            console.log("decoded",decoded)
            // decoded {
            //   userId: 2,
            //   username: 'adib',
            //   is_admin: 1,
            //   iat: 1703795222,
            //   exp: 1703798822
            // }
            next()
        } else {
            result.status = false;
            result.statusCode = 403;
            result.message = "Forbidden: User is not an admin";
            res.send(result);
        }
    })
}

exports.extractUserDetailsMiddleware= (req, res, next) => {
    var result={}
    const token = req.headers.authorization && req.headers.authorization.split(' ')[0];
    if(!token){
        console.log("inside extractUserDetails middleware !token")
        result.status = false;
        result.statusCode = 401;
        result.message = "Unauthorized: Token not provided";
        res.send(result);
    }

    jwt.verify(token, 'MySecretKey', (err, decoded) => {
      if (err) {
        console.log("inside extractUserDetails middleware")
        result.status = false;
        result.statusCode = 401;
        result.message = "Invalid: Token";
        res.send(result);
      }
  
      req.userDetails = decoded;
      console.log("decoded",decoded)
      // decoded {
      //   userId: 2,
      //   username: 'adib',
      //   is_admin: 0,
      //   iat: 1703776923,
      //   exp: 1703780523
      // }
      next();
    });
}
// module.exports={
//     emailExists,
//     phoneExists
// }