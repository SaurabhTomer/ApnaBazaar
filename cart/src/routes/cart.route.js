import express from 'express'
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { addItemToCart, deleteCart, deleteProductFromCart, getCart, updateItemToCart } from '../controllers/cart.controller.js';
import { validateAddItemToCart, validateDeleteItemToCart, validateUpdateItemToCart } from '../middlewares/validation.middleware.js';

const cartRouter = express.Router();



//GET
cartRouter.get('/',
    createAuthMiddleware(['user']),
    getCart
);


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
    createAuthMiddleware(['user']),
    validateUpdateItemToCart,
    updateItemToCart);


//DELETE
cartRouter.delete(
    '/delete-cart',
    createAuthMiddleware(['user']),
    deleteCart)




//DELETE  /cart/item/:productId
cartRouter.delete(
    '/items/:productId',
    createAuthMiddleware(['user']),
    validateDeleteItemToCart,
    deleteProductFromCart);

export default cartRouter;