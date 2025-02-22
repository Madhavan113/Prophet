import mongoose from 'mongoose';
import Product from '../models/product.model.js';

export const createProduct = async (req, res) => {
    const product = req.body; // user will send this data
    try {
        if (!product.name || !product.password) {
            return res.status(400).json({success:false, message:'Please provide all fields!'});
        } else{
            const newProduct = new Product(product);
            await newProduct.save();
            res.status(201).json({success:true, data:product});
        }
    } catch (error) {
        console.error('Error creating product: ', error.message);
        res.status(500).json({success:false, message:'Server Error!'}); // 500 means internal server error
    }
}

export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    console.log("Delete id: ", id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success:false, message:'Invalid product id!'});
    }
    try {
        await Product.findByIdAndDelete(id);
        return res.status(200).json({success:true, message:'Product deleted successfully!'});
    } catch (error){
        console.error('Error deleting product: ', error.message);
        return res.status(500).json({success:false, message:'Server Error!'});
    }   
}

export const updateProduct = async (req, res) => {
    const {id} = req.params;
    const product = req.body;
    try {
        const newProduct = await Product.findByIdAndUpdate(id, product, {new:true}); // anything that requires database 
        await newProduct.save();                                                    // interaction needs the await keyword
        res.status(200).json({success:true, message:'Product edited successfully!'});
    } catch (error){
        console.error('Error editing product: ', error.message);
        res.status(500).json({success:false, message:'Server Error!'});
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find(); // gets all the products!
        res.status(200).json({success:true, data:products});
    } catch (error) {
        console.error('Error getting products: ', error.message);
        res.status(500).json({success:false, message:'Server Error!'});
    }
}