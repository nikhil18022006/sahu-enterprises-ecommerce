const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ===============================
// Place Order
// ===============================
const placeOrder = async (req, res) => {
    try {

        const userId = req.user.id;

        const cart = await Cart.findOne({
            user: userId
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        let totalAmount = 0;

        for (const item of cart.items) {
            totalAmount += item.product.price * item.quantity;
        }

        const order = await Order.create({
            user: userId,

            items: cart.items.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),

            shippingAddress: req.body.shippingAddress,

            paymentMethod: req.body.paymentMethod,

            totalAmount
        });

        // Clear cart
        cart.items = [];
        await cart.save();

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {

        console.error("PLACE ORDER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}; // ✅ placeOrder ends here

// ===============================
// Get My Orders
// ===============================
const getMyOrders = async (req, res) => {
    try {

        const userId = req.user.id;

        const orders = await Order.find({
            user: userId
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        console.error("GET MY ORDERS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ===============================
// Get Order By ID
// ===============================
const getOrderById = async (req, res) => {
    try {

        const orderId = req.params.id;

        const order = await Order.findById(orderId)
            .populate("items.product")
            .populate("user", "name email");

        // Check if order exists
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if the logged-in user owns this order
        // or is an admin
        if (
            order.user._id.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // Return order details
        return res.status(200).json({
            success: true,
            order
        });

    } catch (error) {

        console.error("GET ORDER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// ===============================
// Get All Orders (Admin)
// ===============================
const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        console.error("GET ALL ORDERS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// ===============================
// Update Order Status (Admin)
// ===============================
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await Order.findById(orderId);
        // Check if order exists
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        order.orderStatus = req.body.orderStatus;

        await order.save();
        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {

        console.error("UPDATE ORDER STATUS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
module.exports = {
    placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};