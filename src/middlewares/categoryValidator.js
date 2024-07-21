const { check, validationResult } = require('express-validator');

exports.categoryValidator=[
    check('category_name').exists()
    .withMessage('Category_name is required')
    .not()
    .isEmpty()
    .withMessage('Category_name must not be empty')
    .isLength({ min: 1 }).withMessage('Category name is required'),
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
              result.message = "Invalid " + str;
              console.log("result.message",result.message)
              res.send(result);
          } else{
            next();
          }
      }
]


