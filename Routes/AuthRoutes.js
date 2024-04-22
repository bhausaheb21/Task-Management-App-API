const express = require('express');
const { AuthController } = require('../Controllers');
const { body } = require('express-validator')
const authRouter = express.Router()

authRouter.use([body('email', "Email Must be Valid").isEmail(), body('password', 'Password must be Minimum 8 letters')])
authRouter.post('/', AuthController.login)
authRouter.use([body('firstName', "First Name too Short").isLength({ min: 5 }), body('lastName', "Last Name too Short").isLength({ min: 4 })])
authRouter.post('/signup', AuthController.signup)


module.exports = authRouter;