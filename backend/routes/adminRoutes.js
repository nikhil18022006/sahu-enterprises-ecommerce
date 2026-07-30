const express = require("express");

const router = express.Router();

const { getDashboard } = require("../controllers/adminController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

// ===============================
// Dashboard
// ===============================

router.get(
    "/dashboard",
    protect,
    authorize("admin"),
    getDashboard
);

module.exports = router;