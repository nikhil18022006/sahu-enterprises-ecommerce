const express = require("express");
const router = express.Router();

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// ===============================
// Public Routes
// ===============================

// Get All Products
router.get("/", getProducts);

// Get Product By ID
router.get("/:id", getProductById);

// ===============================
// Admin Routes
// ===============================

// Create Product
router.post(
    "/",
    protect,
    authorize("admin"),
    upload.array("images", 5),
    createProduct
);

// Update Product
router.put(
    "/:id",
    protect,
    authorize("admin"),
    upload.array("images", 5),
    updateProduct
);

// Delete Product
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteProduct
);

module.exports = router;