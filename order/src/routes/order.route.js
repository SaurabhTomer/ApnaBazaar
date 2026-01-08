import express from 'express'
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { createOrder, getMyOrders, getOrderById } from '../controllers/order.controller.js';
import { createOrdervalidation } from '../middlewares/validation.middleware.js';

const orderRouter = express.Router();

//POST
orderRouter.post("/" , createAuthMiddleware(["user"]) , createOrdervalidation , createOrder )

//GET
orderRouter.get("/me" , createAuthMiddleware(["user"])  , getMyOrders )

//GET user nad seller
router.get("/:id", createAuthMiddleware([ "user", "admin" ]),getOrderById )



export default orderRouter;