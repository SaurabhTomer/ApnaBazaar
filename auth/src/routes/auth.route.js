import express from 'express'
import { addUserAddressValidations, loginUserValidations, registerUserValidations } from '../middlewares/validator.middleware.js'
import { addUseraddress, deleteUserAddress, getCurrentUser, getUserAddress, loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js'
import { authMiddleware } from './../middlewares/auth.middleware.js';


const authRouter = express.Router()


authRouter.post('/register' , registerUserValidations , registerUser)
authRouter.post('/login' , loginUserValidations , loginUser)
authRouter.get('/me' ,authMiddleware, getCurrentUser)
authRouter.get('/logout' , logoutUser)

authRouter.post('/users/me/add-address',addUserAddressValidations , authMiddleware, addUseraddress)
authRouter.get('/users/me/addresses'  , authMiddleware ,  getUserAddress )
authRouter.delete('/users/me/addresses/:addressId' ,   authMiddleware ,deleteUserAddress)


export default authRouter;