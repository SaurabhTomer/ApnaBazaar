import express from 'express'
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { addItemToCart, updateItemToCart } from '../controllers/cart.controller.js';
import { validateAddItemToCart, validateUpdateItemToCart } from '../middlewares/validation.middleware.js';

const cartRouter = express.Router();

//POST 
cartRouter.post(
    '/items',
    createAuthMiddleware(["user"]),
    validateAddItemToCart,
    addItemToCart
);


//PATCH
cartRouter.patch(
    '/items/:productId',
    validateUpdateItemToCart,
    createAuthMiddleware(['user']),
    updateItemToCart);

export default cartRouter;