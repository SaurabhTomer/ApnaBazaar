import mongoose from "mongoose";

const paymentSchema  = new mongoose.Schema({

    order:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    paymentId:{     //payment id generate by paymentid
        type:String,
    },
    razorpayOrderId:{       //this orderId generateby razorpay
        type:String,
        required:true
    },
    signature:{
        type:String
    },
    status:{
        type:String,
        enum:["PENDING" , "COMPLETED" , "FAILED"],
        default:"PENDING",
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    price:{         //price of order and currency
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            required:true,
            default:"INR",
            enum:["INR" , "USD"]
        }
    }
}, {timestamps:true})


const paymentModel = mongoose.model('Payment' , paymentSchema)
export default paymentModel;