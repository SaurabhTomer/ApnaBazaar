import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    price:{
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            enum:['USD' , 'INR'],
            default:'INR'
        }
    },
    seller:{    // we didnt give reference beacuse data base is different
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    images:[{
        url:String,
        thumbnail:String,
        id:String
    }]

},{timestamps:true})

// Create text index for full-text search on product title and description
productSchema.index({ title: "text", description: "text" });

const productModel = mongoose.model('Product' , productSchema)

export default productModel;