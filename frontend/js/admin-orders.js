// ==========================================
// SAHU ENTERPRISES
// ADMIN ORDERS
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
// LOAD ORDERS
// ==========================================

async function loadOrders() {

    try {

        const response = await fetch(`${BASE_URL}/orders`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Unable to load orders.");

            return;

        }

        const ordersList = document.getElementById("orders-list");

        ordersList.innerHTML = "";

        data.orders.forEach(order => {

            ordersList.innerHTML += `

                <tr>

                    <td>${order._id}</td>

                    <td>${order.user?.name || "N/A"}</td>

                    <td>₹${order.totalAmount}</td>

                    <td>${order.paymentMethod}</td>

                    <td>

                        <select
                            class="status-select"
                            onchange="updateStatus('${order._id}', this.value)"
                        >

                            <option value="Pending" ${order.orderStatus === "Pending" ? "selected" : ""}>Pending</option>

                            <option value="Confirmed" ${order.orderStatus === "Confirmed" ? "selected" : ""}>Confirmed</option>

                            <option value="Packed" ${order.orderStatus === "Packed" ? "selected" : ""}>Packed</option>

                            <option value="Shipped" ${order.orderStatus === "Shipped" ? "selected" : ""}>Shipped</option>

                            <option value="Out for Delivery" ${order.orderStatus === "Out for Delivery" ? "selected" : ""}>Out for Delivery</option>

                            <option value="Delivered" ${order.orderStatus === "Delivered" ? "selected" : ""}>Delivered</option>

                            <option value="Cancelled" ${order.orderStatus === "Cancelled" ? "selected" : ""}>Cancelled</option>

                        </select>

                    </td>

                    <td>

                        ${new Date(order.updatedAt).toLocaleString()}

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error("Load Orders Error:", error);

        alert("Unable to load orders.");

    }

}

// ==========================================
// UPDATE STATUS
// ==========================================

async function updateStatus(orderId, orderStatus) {

    try {

        const response = await fetch(

            `${BASE_URL}/orders/${orderId}/status`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({

                    orderStatus

                })

            }

        );

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Failed to update order.");

            return;

        }

        alert("Order updated successfully.");

        loadOrders();

    } catch (error) {

        console.error("Update Status Error:", error);

        alert("Unable to update order.");

    }

}

// ==========================================
// SEARCH ORDERS
// ==========================================

document.getElementById("search-order")
.addEventListener("input", function () {

    const search = this.value.toLowerCase();

    document.querySelectorAll("#orders-list tr").forEach(row => {

        row.style.display = row.textContent
            .toLowerCase()
            .includes(search)
            ? ""
            : "none";

    });

});

// ==========================================
// PAGE LOAD
// ==========================================

loadOrders();