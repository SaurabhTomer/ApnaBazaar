import express from 'express'
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { createOrder } from '../controllers/order.controller.js';

const orderRouter = express.Router();

//POST
orderRouter.post("/" , createAuthMiddleware(["user"]) ,createOrder )


export default orderRouter;