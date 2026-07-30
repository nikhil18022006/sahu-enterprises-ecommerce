// ==========================================
// SAHU ENTERPRISES
// ADMIN DASHBOARD
// ==========================================
const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {

    alert("Access Denied");

    window.location.href = "../login.html";

}
const BASE_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

// ==========================================
// CHECK LOGIN
// ==========================================

if (!token) {

    alert("Please login first.");

    window.location.href = "../login.html";

}

// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        const response = await fetch(`${BASE_URL}/admin/dashboard`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

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

        console.error(error);

        alert("Unable to load dashboard.");

    }

}

// ==========================================
// LOGOUT
// ==========================================

document.getElementById("logout-btn")
.addEventListener("click", function () {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "../login.html";

});

// ==========================================
// PAGE LOAD
// ==========================================

loadDashboard();