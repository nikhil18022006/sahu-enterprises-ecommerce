const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, placeOrder);

router.get("/my-orders", protect, getMyOrders);

// Keep this AFTER "/my"
router.get("/:id", protect, getOrderById);

router.get("/", protect, authorize("admin"), getAllOrders);

router.put(
    "/:id/status",
    protect,
    authorize("admin"),
    updateOrderStatus
);

module.exports = router;