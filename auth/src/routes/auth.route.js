import express from 'express'
import { loginUserValidations, registerUserValidations } from '../middlewares/validator.middleware.js'
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js'

const authRouter = express.Router()


authRouter.post('/register' , registerUserValidations , registerUser)
authRouter.post('/login' , loginUserValidations , loginUser)
authRouter.get('/me' , getCurrentUser)
authRouter.get('/logout' , logoutUser)

export default authRouter;