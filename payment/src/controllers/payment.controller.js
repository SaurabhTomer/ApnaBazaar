import dotenv from 'dotenv'
dotenv.config()
import paymentModel from '../models/payment.model.js';
import axios from "axios";
import Razorpay from 'razorpay';


//razorpay instance
const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
});


//create payment controller
export const createPayment = async (req , res) => {

    //fetch token
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

        try {
        //fetch order id
        const orderId = req.params.orderId;
            //fetch order from order service 
        const orderResponse = await axios.get('http://localhost:3003/api/orders/' + orderId , {
            headers:{
                Authorization : `Bearer ${token}`
            }
        })

        // console.log(orderResponse.data.order.totalPrice);
        const price = orderResponse.data.order.totalPrice;

        //craete razorpay order
        const order  = await razorpay.orders.create(price);

        // payemnt craeted
       const payment = await paymentModel.create({
            order : orderId,
            razorpayOrderId:order.id,
            user:req.user.id,
            price:{
                amount:order.amount,
                currency:order.currency
            }
       })

       //return res
        return res.status(201).json({message:"Payment Initaited" , payment});

      
        

    } catch (error) {
        
         console.log("craete Payment error" , error);
         res.status(500).json({ message: "Internal server error" }); 
     }
}
    
