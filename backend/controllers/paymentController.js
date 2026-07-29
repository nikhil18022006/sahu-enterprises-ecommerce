const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid amount is required"
            });
        }

        const options = {
            amount: amount * 100, // Convert ₹ to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const razorpayOrder = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            message: "Razorpay order created successfully",
            order: razorpayOrder
        });

    } catch (error) {

        console.error("CREATE PAYMENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Verify Payment

const verifyPayment = async (req, res) => {
    console.log("VERIFY PAYMENT API HIT");
    console.log(req.body);
    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            shippingAddress,
            paymentMethod
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details are missing"
            });
        }

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

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

        const newOrder = await Order.create({
            user: userId,

            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),

            shippingAddress,

            paymentMethod,

            totalAmount,

            paymentStatus: "Paid",

            orderStatus: "Confirmed",

            razorpayOrderId: razorpay_order_id,

            razorpayPaymentId: razorpay_payment_id
        });

        cart.items = [];
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order: newOrder
        });

    } catch (error) {

        console.error("VERIFY PAYMENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createRazorpayOrder,
    verifyPayment
};