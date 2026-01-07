import cartModel from "../models/cart.model.js";


export const getCart = async (req, res) => {
    try {
        //fetch user
        const userId = req.user.id;

        // find cart of this user
        let cart = await cartModel.findOne({
            user: userId
        });

        //if cart not found then craete one and save
        if (!cart) {
            cart = new cartModel({ user: userId, items: [] })
            await cart.save();
        }
        return res.status(200).json(
            { 
            cart,
            totals:{
                itemCount:cart.items.length,
                totalQuantity: cart.items.reduce((sum , item) => sum + item.quantity , 0)
            }
         });

    } catch (error) {
        console.error("get  cart error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}


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
                user: userId,       // in micro we use like this userid go to user
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

export const updateItemToCart = async (req, res) => {
    try {


        // console.log("Request headers:", req.headers);  // Check Content-Type
        // console.log("Request body:", req.body);       // Should show your JSON
        // console.log("Request cookies:", req.cookies); // Verify token is present
        //id from param
        const { productId } = req.params;
        // console.log(productId);
        // console.log(req.cookies);
        
        
        //quantity from body
        const { quantity } = req.body;
        // console.log( "type of quantity" , typeof quantity);
        

        const userId = req.user.id;

        //check cart exist not
        let cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        //check if item present in cart or not 
        const existingCart = cart.items.findIndex(item => item.productId.toString() === productId)
        if (existingCart < 0) {
            return res.status(404).json({ message: "Item not found" });
        }
        else {
            cart.items[existingCart].quantity = quantity;
        }

        //save cart
        await cart.save();
        return res.status(200).json({ message: "Item updated", cart });
    } catch (error) {
        console.error("update Item TO cart error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const deleteCart = async (req, res) => {
    try {
        ///fetch user
        const userId = req.user.id;

        //find cart and delete
        const cart = await cartModel.findOneAndDelete({ user: userId });

        //if cart not found
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        return res.status(200).json({
            message: "Cart deleted successfully",
            cart,
        });


    } catch (error) {
        console.error("Delete cart error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const deleteProductFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const userId = req.user.id;
        console.log(productId);
        
        // Remove product from cart using $pull to remove the specific item
        const cart = await cartModel.findOneAndUpdate(
            { user: userId },
            {
                $pull: {
                    items: {
                        productId: productId
                    }
                }
            },
            { new: true }
        )
        console.log(cart);
        if (!cart) {
            return res.status(404).json({
                message: "Cart or product not found",
            });
        }

        return res.status(200).json({
            message: "Product removed from cart",
            cart,
        });

    } catch (error) {
        console.log("delete cart item error :", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}