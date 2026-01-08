import express from 'express'
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { createPayment } from '../controllers/payment.controller.js';



const paymentRouter = express.Router()

//POST
paymentRouter.post('/create/:orderId' , createAuthMiddleware(["user"]) , createPayment)




export default paymentRouter;