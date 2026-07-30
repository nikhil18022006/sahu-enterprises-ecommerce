const express = require("express");
const router = express.Router();

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getProfile,
    adminDashboard,

    // Admin User Management
    getAllUsers,
    updateUserRole,
    deleteUser

} = require("../controllers/userController");

console.log("✅ userRoutes Loaded");

// ===============================
// Test Route
// ===============================
router.get("/test", (req, res) => {
    console.log("GET TEST HIT");
    res.send("GET Route Working");
});

// ===============================
// Authentication Routes
// ===============================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Profile
router.get("/profile", protect, getProfile);

// ===============================
// Admin Dashboard
// ===============================

router.get(
    "/admin",
    protect,
    authorize("admin"),
    adminDashboard
);

// ===============================
// Admin User Management
// ===============================

// Get All Users
router.get(
    "/all",
    protect,
    authorize("admin"),
    getAllUsers
);

// Update User Role
router.put(
    "/:id/role",
    protect,
    authorize("admin"),
    updateUserRole
);

// Delete User
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteUser
);

module.exports = router;