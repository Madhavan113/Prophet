import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
},{
    timestamps: true
}); // create a new schema

const Product = mongoose.model("Product", productSchema); // create a new model

export default Product; // export the model