// ==========================================
// SAHU ENTERPRISES
// ADMIN DASHBOARD
// ==========================================

const BASE_URL = "https://sahu-enterprises-ecommerce.onrender.com/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

// ==========================================
// CHECK LOGIN
// ==========================================

if (!token || !user) {

    alert("Please login first.");

    window.location.href = "../login.html";

}

if (user.role !== "admin") {

    alert("Access Denied");

    window.location.href = "../login.html";

}

// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        const response = await fetch(`${BASE_URL}/admin/dashboard`, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Failed to load dashboard.");

            return;

        }

        document.getElementById("total-users").textContent =
            data.dashboard.totalUsers;

        document.getElementById("total-products").textContent =
            data.dashboard.totalProducts;

        document.getElementById("total-orders").textContent =
            data.dashboard.totalOrders;

        document.getElementById("total-revenue").textContent =
            "₹" + data.dashboard.totalRevenue;

    } catch (error) {

        console.error("Dashboard Error:", error);

        alert("Unable to load dashboard.");

    }

}

// ==========================================
// LOGOUT
// ==========================================

document.getElementById("logout-btn").addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "../login.html";

});

// ==========================================
// PAGE LOAD
// ==========================================

loadDashboard();