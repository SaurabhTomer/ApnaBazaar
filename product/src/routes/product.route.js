import express from 'express'
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import multer from 'multer';
import { createProductValidators } from './../validators/product.validator.js';
import { createProduct } from '../controllers/product.controller.js';

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

export default productRouter;