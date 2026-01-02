
import { uploadImage } from '../services/imagekit.service.js';
import productModel from './../models/product.model.js';


export const createProduct = async (req, res) => {
  try {

    const { title, description, priceAmount, priceCurrency = "INR" } = req.body;

    // Get seller ID from authenticated user
    const seller = req.user.id;

    // Prepare price object with amount and currency
    const price = {
      amount: Number(priceAmount),
      currency: priceCurrency,
    };

    // Upload product images to ImageKit and collect their URLs
    const images = await Promise.all(
      (req.files || []).map(file =>
        uploadImage({ buffer: file.buffer })
      )
    );

    const product = await productModel.create({
      title,
      description,
      price,
      seller,
      images,
    });

    return res.status(201).json({
      message: "Product created",
      data: product,
    });
  } catch (error) {

    console.error("Create product error", error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};

export const getProducts = async (req, res) => {
  try {
    // Extract query parameters for search, price filter, and pagination
    const { q, minprice, maxprice, skip = 0, limit = 20 } = req.query;

    const filters = {};

    // Apply full-text search on title and description if query exists
    if (q) {
      filters.$text = { $search: q };
    }

    // Apply minimum price filter
    if (minprice) {
      filters["price.amount"] =
       {
        ...filters["price.amount"],
        $gte: Number(minprice),
      };
    }

    // Apply maximum price filter
    if (maxprice) {
      filters["price.amount"] =
       {
        ...filters["price.amount"],
        $lte: Number(maxprice),
      };
    }

    // Fetch products with filters and pagination
    const products = await productModel
      .find(filters)
      .skip(Number(skip))
      .limit(Math.min(Number(limit) , 20 ));

    // Send products as response
    return res.status(200).json({
      data: products,
    });

  } catch (error) {
    // Log error for debugging
    console.error("Get products error:", error);

    // Send generic server error response
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const getproductById = async (req, res) => {
  try {

    const { id } = req.params;

    const product = await productModel.findById(id);


    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      product: product,
    });

  } catch (error) {
 
    console.error("Get product by ID error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
