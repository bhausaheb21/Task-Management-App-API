const express = require('express');
const { AuthController } = require('../Controllers');

const authRouter = express.Router()

authRouter.post('/', AuthController.login)
authRouter.post('/signup', AuthController.signup)


module.exports = authRouter;