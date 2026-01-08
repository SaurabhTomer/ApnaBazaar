import mongoose from "mongoose";

const paymentSchema  = new mongoose.Schema({

    order:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    paymentId:{     //payment id generate by paymentid
        type:String,
    },
    orderId:{       //this orderId generateby razorpay
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
    }
}, {timestamps:true})


const paymentModel = mongoose.model('Payment' , paymentSchema)
export default paymentModel;