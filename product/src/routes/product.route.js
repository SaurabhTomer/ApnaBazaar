import express from 'express'
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import multer from 'multer';
import { createProductValidators } from './../validators/product.validator.js';
import { createProduct, deleteProduct, getproductById, getProducts, getProductsBySeller, updateProduct } from '../controllers/product.controller.js';

const productRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

//POST
productRouter.post(
    '/',
    createAuthMiddleware(['admin', 'seller']),
    upload.array('images', 5),
    createProductValidators,
    createProduct
);

//GET
productRouter.get('/', createAuthMiddleware(['user']), getProducts)


//PATCH
productRouter.patch('/:id', createAuthMiddleware(['seller']), updateProduct)

//DELETE
productRouter.delete('/:id', createAuthMiddleware(['seller']), deleteProduct)

//GET
productRouter.get('/seller', createAuthMiddleware(['seller']), getProductsBySeller)

//GET api/products/:id
productRouter.get('/:id', createAuthMiddleware(['user']), getproductById)

export default productRouter;