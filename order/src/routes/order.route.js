import express from 'express'
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { cancelOrderById, createOrder, getMyOrders, getOrderById, updateOrderAddress } from '../controllers/order.controller.js';
import { createOrdervalidation, updateAddressValidation } from '../middlewares/validation.middleware.js';

const orderRouter = express.Router();

//POST
orderRouter.post("/" , createAuthMiddleware(["user"]) , createOrdervalidation , createOrder )

//GET
orderRouter.get("/me" , createAuthMiddleware(["user"])  , getMyOrders )

//POST
orderRouter.post("/:id/cancel", createAuthMiddleware([ "user" ]), cancelOrderById)

//PATCH
orderRouter.patch("/:id/address", createAuthMiddleware([ "user" ]), updateAddressValidation, updateOrderAddress)

//GET user and seller
orderRouter.get("/:id", createAuthMiddleware([ "user", "admin" ]),getOrderById )



export default orderRouter;