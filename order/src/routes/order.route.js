import express from 'express'
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { createOrder } from '../controllers/order.controller.js';
import { createOrdervalidation } from '../middlewares/validation.middleware.js';

const orderRouter = express.Router();

//POST
orderRouter.post("/" , createAuthMiddleware(["user"]) , createOrdervalidation , createOrder )


export default orderRouter;