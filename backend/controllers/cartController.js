const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ===============================
// Add Product to Cart
// ===============================
const addToCart = async (req, res) => {
    try {

        // Logged-in User ID
        const userId = req.user.id;

        // Request Body
        const {
            productId,
            quantity = 1
        } = req.body;

        // Validate Product ID
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        // Check if Product Exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Find User Cart
        let cart = await Cart.findOne({ user: userId });

        console.log("========== ADD TO CART ==========");
        console.log("User ID:", userId);
        console.log("Product ID:", productId);
        console.log("Cart Found:", cart);
        console.log("Items Before:", cart ? cart.items : []);

        // If Cart Doesn't Exist, Create One
        if (!cart) {

            cart = new Cart({
                user: userId,
                items: [
                    {
                        product: productId,
                        quantity
                    }
                ]
            });

            await cart.save();

            return res.status(201).json({
                success: true,
                message: "Cart created successfully",
                cart
            });
        }

        // Check if Product Already Exists in Cart
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex > -1) {

            // Increase Quantity
            cart.items[itemIndex].quantity += quantity;

        } else {

            // Add New Product
            cart.items.push({
                product: productId,
                quantity
            });

        }

        // Save Updated Cart
        console.log("Items After:", cart.items);

        await cart.save();

        console.log("Cart Saved Successfully");

        return res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart
        });

    } catch (error) {

        console.error("ADD TO CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ===============================
// Get Logged-in User's Cart
// ===============================
const getCart = async (req, res) => {
    try {

        // Logged-in User ID
        const userId = req.user.id;

        // Find User's Cart and Populate Product Details
        const cart = await Cart.findOne({ user: userId })
            .populate("items.product");

        // Check if Cart Exists
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Return Cart
        return res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {

        console.error("GET CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// ===============================
// Update Cart Item Quantity
// ===============================
const updateCart = async (req, res) => {
    try {

        // Logged-in User ID
        const userId = req.user.id;

        // Product ID from URL
        const { productId } = req.params;

        // Updated Quantity from Request Body
        const { quantity } = req.body;
        // Validate Quantity
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }
        // Find User's Cart
        const cart = await Cart.findOne({ user: userId });

        // Check if Cart Exists
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }
        // Find Product in Cart
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        // Check if Product Exists in Cart
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }
        // Update Product Quantity
        cart.items[itemIndex].quantity = quantity;

        // Save Updated Cart
        await cart.save();

        // Return Success Response
        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart
        });

    } catch (error) {

        console.error("UPDATE CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// ===============================
// Remove Product from Cart
// ===============================
const removeFromCart = async (req, res) => {
    try {

        // Logged-in User ID
        const userId = req.user.id;

        // Product ID from URL
        const { productId } = req.params;
        // Find User's Cart
        const cart = await Cart.findOne({ user: userId });

        // Check if Cart Exists
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }
        // Find Product in Cart
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        // Check if Product Exists in Cart
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }
        // Remove Product from Cart
        cart.items.splice(itemIndex, 1);

        // Save Updated Cart
        await cart.save();

        // Return Success Response
        return res.status(200).json({
            success: true,
            message: "Product removed from cart successfully",
            cart
        });

    } catch (error) {

        console.error("REMOVE FROM CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
module.exports = {
    addToCart,
    getCart,
    updateCart,
    removeFromCart
};