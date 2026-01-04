import express from 'express'
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { addItemToCart, deleteCart, deleteProductFromCart, getCart, updateItemToCart } from '../controllers/cart.controller.js';
import { validateAddItemToCart, validateDeleteItemToCart, validateUpdateItemToCart } from '../middlewares/validation.middleware.js';

const cartRouter = express.Router();



//GET
router.get('/',
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

//DELETE
cartRouter.delete(
    '/',
    createAuthMiddleware(['user']),
    deleteCart)


//PATCH
cartRouter.patch(
    '/items/:productId',
    validateUpdateItemToCart,
    createAuthMiddleware(['user']),
    updateItemToCart);

//DELETE  /cart/items/:productId
cartRouter.delete(
    '/:productId',
    validateDeleteItemToCart,
    createAuthMiddleware(['user']),
    deleteProductFromCart);

export default cartRouter;