const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {

    alert("Access Denied");

    window.location.href = "../login.html";

}



const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// ===============================
// Dashboard Statistics
// ===============================

const getDashboard = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();

        const revenue = await Order.aggregate([
            {
                $match: {
                    paymentStatus: {
                        $in: ["Paid", "Pending"]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);

        res.status(200).json({

            success: true,

            dashboard: {

                totalUsers,

                totalProducts,

                totalOrders,

                totalRevenue:
                    revenue.length > 0
                        ? revenue[0].totalRevenue
                        : 0

            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    getDashboard

};