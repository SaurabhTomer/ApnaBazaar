import dotenv from 'dotenv'
dotenv.config()
import paymentModel from '../models/payment.model.js';
import axios from "axios";
import Razorpay from 'razorpay';
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js';


//razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


//create payment controller
export const createPayment = async (req, res) => {

    //fetch token
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    try {
        //fetch order id
        const orderId = req.params.orderId;
        //fetch order from order service 
        const orderResponse = await axios.get('http://localhost:3003/api/orders/' + orderId, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        // console.log(orderResponse.data.order.totalPrice);
        const price = orderResponse.data.order.totalPrice;

        //craete razorpay order
        const order = await razorpay.orders.create(price);

        // payemnt created
        const payment = await paymentModel.create({
            order: orderId,
            razorpayOrderId: order.id,
            user: req.user.id,
            price: {
                amount: order.amount,
                currency: order.currency
            }
        })

        //return res
        return res.status(201).json({ message: "Payment Initaited", payment });




    } catch (error) {

        console.log("craete Payment error", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


// controller to verify payment
export const verifyPayment = async (req, res) => {


    //fetch deatils from body
    const { razorpayOrderId, paymentId, signature } = req.body;
    const secret = process.env.Razorpay;

    try {
        //check is payemnt is valid or not
       const isValid = validatePaymentVerification({
        order_id : razorpayOrderId,
        payment_id : paymentId,
        signature,
        secret
       })


       if( !isValid){
        return res.status(400).json({message:"Invalid signature"})
       }

       //id status pending is not given here then we can craeate same payment  one by one
       const payment = await paymentModel.findOne({ razorpayOrderId , status:"PENDING" });

        if( !payment){
        return res.status(404).json({message:"Payment not found"})
       }

       //update payment fields
       payment.paymentId = payment;
       payment.signature = signature;
       payment.status = "COMPLETED";

       //save payment
       await payment.save();


        return res.status(200).json({message:"Payment verified successfully" , payment})

    } catch (error) {

        console.log("verify  Payment error", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
