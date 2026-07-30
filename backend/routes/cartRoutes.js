const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCart,
    updateCart,
    removeFromCart
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

// Add Product to Cart
router.post("/", protect, addToCart);

// Get Logged-in User's Cart
router.get("/", protect, getCart);

// Update Cart Quantity
router.put("/:productId", protect, updateCart);

router.delete("/:productId", protect, removeFromCart);

module.exports = router;