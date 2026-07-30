// ==========================================
// SAHU ENTERPRISES SERVER
// ==========================================

console.log("🚀 SERVER FILE LOADED");

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dns = require("dns");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dns.setServers(["1.1.1.1", "8.8.8.8"]);

connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================



app.use((req, res, next) => {
    console.log("================================");
    console.log("METHOD :", req.method);
    console.log("URL    :", req.originalUrl);
    console.log("BODY   :", req.body);
    console.log("================================");
    next();
});

// ==========================================
// ROUTES
// ==========================================


// Test Route
app.get("/", (req, res) => {
    res.send("🚀 Sahu Enterprises Backend Running...");
});
app.post("/test", (req, res) => {
    console.log("✅ TEST ROUTE HIT");
    console.log(req.body);

    return res.json({
        success: true,
        message: "Test Route Working"
    });
});

// User Routes
app.use("/api/users", userRoutes);

// Product Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
console.log("✅ userRoutes Mounted");
console.log("✅ productRoutes Mounted");


// ==========================================
// 404 ROUTE
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:");
    console.error(err);

    res.status(500).json({
        success: false,
        message: err.message
    });
});

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});