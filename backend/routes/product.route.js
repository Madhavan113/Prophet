import express from "express";
import Product from "../models/product.model.js";
import {createProduct, deleteProduct, updateProduct, getProducts} from "../controllers/product.controller.js";

const router = express.Router();

router.post('/', createProduct);
router.delete('/:id', deleteProduct);
router.put('/:id', updateProduct)
router.get('/', getProducts)


export default router; // export the router