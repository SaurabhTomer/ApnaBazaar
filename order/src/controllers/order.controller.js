import orderModel from "../models/order.model.js";
import axios from "axios";


export const createOrder = async (req, res) => {

    const userId = req.user.id;
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    try {
        // fetch user cart from cart service
        const cartResponse = await axios.get(`http://localhost:3002/api/cart`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        // console.log(cartResponse.data);

        const products = await Promise.all(cartResponse.data.cart.items.map(async (item) => {

            return( await axios.get(`http://localhost:3001/api/products/${item.productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )).data.product
        }
    ))

        // console.log( "product fetched ",products);

        let priceAmount = 0;
        let currency = null;

        // return array
        const orderItems = cartResponse.data.cart.items.map((item , index) => {

            //find product 
            const product = products.find( p => p._id === item.productId)
            // console.log(product);

            if (!currency) {
                currency = product.price.currency; // store once
             }
            

            // //if not in stock , does not allow creation
            // if( !product.stock || product.stock < item.quantity){
            //     throw new Error(`Product ${product.title} is out of stock or insufficent`)
            // }

            //calculate price of product
            const itemTotal = product.price.amount * item.quantity;
            priceAmount += itemTotal;

            return {
                product : item.productId,
                quantity:item.quantity,
                price:{
                    amount:itemTotal,
                    currency:product.price.currency,
                }
            }
        }) 

        // console.log(priceAmount);
        // console.log(orderItems);
        // console.log(currency);
        

        const order = await orderModel.create({
            user:userId,
            items:orderItems,
            status:"PENDING",
            totalPrice:{
                amount:priceAmount,
                currency:currency
            },
            shippingAddress: req.body.shippingAddress
        })
        
        
        return res.status(201).json({ message: "create order success" , order })

    } catch (error) {
        console.log('create order error', error);
        return res.status(500).json({ message: "Internal server error" })

    }
}