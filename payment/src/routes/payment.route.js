import express from 'express'
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { createPayment, verifyPayment } from '../controllers/payment.controller.js';



const paymentRouter = express.Router()

//POST
paymentRouter.post('/create/:orderId' , createAuthMiddleware(["user"]) , createPayment)

//POST
paymentRouter.post('/verify' , createAuthMiddleware(["user"]) , verifyPayment)


export default paymentRouter;