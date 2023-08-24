const { Router } = require('express')
const { register, login } = require('../controller/auth-controller.js')
const { body } = require('express-validator')

const authRouter = Router()

authRouter.post('/register', body('username').trim(), register)
authRouter.post('/login', login)

module.exports = authRouter