
import { uploadImage } from '../services/imagekit.service.js';
import productModel from './../models/product.model.js';
import mongoose from 'mongoose';

export const createProduct = async (req, res) => {
    try {
        const { title, description, priceAmount, priceCurrency = 'INR' } = req.body;
        const seller = req.user.id; // Extract seller from authenticated user
        const price = {
            amount: Number(priceAmount),
            currency: priceCurrency,
        };
        const images = await Promise.all((req.files || []).map(file => uploadImage({ buffer: file.buffer })));

        const product = await productModel.create({ title, description, price, seller, images });
        return res.status(201).json({
            message: 'Product created',
            data: product,
        });
    } catch (error) {
        console.error('Create product error', error);
        return res.status(500).json({ message: 'Internal server error' });

    }
}