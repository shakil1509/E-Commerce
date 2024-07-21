var express = require('express');
var router = express.Router();
const authController= require('../controllers/authController');
const authValidator=require('../middlewares/validator')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',authValidator.registrationValidator,authController.signUp)
// router.post('/signup',(req,res)=>{
//   console.log("here is the body",req.body)
// })
router.post('/login',authValidator.loginValidator,authController.login)
// router.post('/checkAdmin',authValidator.checkAdmin)
router.post('/extractUserDetails',authValidator.extractUserDetailsMiddleware)
// router.post('/login',authController.login)

router.get('/me',authValidator.extractUserDetailsMiddleware,
authController.extractUserDetails)

router.post('/changePassword',
authValidator.extractUserDetailsMiddleware,
authValidator.passwordValidator,
authController.changePassword)

module.exports = router;