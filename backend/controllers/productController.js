const Product = require("../models/Product");

const createProduct = async (req, res) => {

    try {

        const productData = {
            ...req.body
        };

        if (req.files && req.files.length > 0) {

            productData.images = req.files.map(file => file.path);

        }

        const product = await Product.create(productData);

        return res.status(201).json({
            success: true,
            product
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const getProducts = async (req, res) => {
    try {

        const products = await Product.find();

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const getProductById = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const updateProduct = async (req, res) => {

    try {

        const { id } = req.params;

        const updatedData = {
            ...req.body
        };

        if (req.files && req.files.length > 0) {

            updatedData.images = req.files.map(file => file.path);

        }

        const product = await Product.findByIdAndUpdate(

            id,
            updatedData,
            {
                new: true,
                runValidators: true
            }

        );

        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const deleteProduct = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};