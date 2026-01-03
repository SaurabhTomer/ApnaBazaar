import cartModel from "../models/cart.model.js";


export const addItemToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const userId = req.user.id;
        // console.log(req.user);

        //find cart related to user
        let cart = await cartModel.findOne({ user: userId });

        // create cart with item directly
        if (!cart) {
            cart = await cartModel.create({
                user: userId,
                items: [{ productId, quantity }]
            });


            return res.status(201).json({
                message: "Cart created and item added",
                cart
            });
        }

        // Find the index of the product in cart items array
        // Returns index (0,1,2,...) if found, otherwise -1
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        // If product already exists in cart
        if (existingItemIndex > -1) {
            // Increase quantity of existing product
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Product not in cart, add new item
            cart.items.push({ productId, quantity: quantity });
        }
        await cart.save();

        return res.status(200).json({
            message: "Item added to cart",
            cart
        });

    } catch (error) {
        console.error("addItemToCart error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}