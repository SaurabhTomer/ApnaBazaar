import orderModel from "../models/order.model.js";
import axios from "axios";


export const createOrder = async (req, res) => {

    const user = req.user.id;
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    try {
        // fetch user cart from cart service
        const cartResponse = await axios.get(`http://localhost:3002/api/cart`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(cartResponse.data);

    } catch (error) {
        console.log('create order error', error);
        return res.status(500).json({ message: "Internal server error" })

    }
}