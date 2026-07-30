const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ], shippingAddress: {
            fullName: {
                type: String,
                required: true,
                trim: true
            },

            phone: {
                type: String,
                required: true,
                trim: true
            },

            address: {
                type: String,
                required: true,
                trim: true
            },

            city: {
                type: String,
                required: true,
                trim: true
            },

            state: {
                type: String,
                required: true,
                trim: true
            },

            pincode: {
                type: String,
                required: true,
                trim: true
            },

            country: {
                type: String,
                default: "India",
                trim: true
            }
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ["COD", "UPI", "CARD", "NET_BANKING"]
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        orderStatus: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Packed",
                "Shipped",
                "Out for Delivery",
                "Delivered",
                "Cancelled"
            ],
            default: "Pending"
        },

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Failed",
                "Refunded"
            ],
            default: "Pending"
        },

        razorpayOrderId: {
            type: String
        },

        razorpayPaymentId: {
            type: String
        }
    },

    {
        timestamps: true
    });
module.exports = mongoose.model("Order", orderSchema);