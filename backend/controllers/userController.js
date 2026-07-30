const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// Register User
// ===============================
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user
        });

    } catch (error) {

        console.error("REGISTER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/// ===============================
// Login User
// ===============================
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        console.log("Login Email:", email);

        const user = await User.findOne({ email });

        console.log("User Found:", user ? "YES" : "NO");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        console.log("Stored Hash:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// ===============================
// Get Profile
// ===============================
const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.error("PROFILE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ===============================
// Admin Dashboard
// ===============================
const adminDashboard = async (req, res) => {
    try {

        return res.status(200).json({
            success: true,
            message: "Welcome Admin!",
            admin: req.user
        });

    } catch (error) {

        console.error("ADMIN DASHBOARD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ===============================
// Get All Users (Admin)
// ===============================
const getAllUsers = async (req, res) => {
    try {

        const users = await User
            .find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {

        console.error("GET USERS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ===============================
// Update User Role (Admin)
// ===============================
const updateUserRole = async (req, res) => {
    try {

        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {

            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });

        }

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        user.role = role;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user
        });

    } catch (error) {

        console.error("UPDATE ROLE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ===============================
// Delete User (Admin)
// ===============================
const deleteUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        await User.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {

        console.error("DELETE USER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const Order = require("../models/Order");

// =======================================
// Get Logged-in User Orders
// =======================================
exports.getMyOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            user: req.user.id
        })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });

    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    adminDashboard,
    getAllUsers,
    updateUserRole,
    deleteUser
};