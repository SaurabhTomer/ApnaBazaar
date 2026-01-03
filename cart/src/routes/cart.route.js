import express from 'express'
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { addItemToCart } from '../controllers/cart.controller.js';
import { validateAddItemToCart } from '../middlewares/validation.middleware.js';

const cartRouter = express.Router();

//POST 
cartRouter.post(
    '/items',
    createAuthMiddleware(["user"]),
    validateAddItemToCart,
    addItemToCart
);


export default cartRouter;