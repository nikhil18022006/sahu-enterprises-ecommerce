// ==========================================
// SAHU ENTERPRISES
// ORDER DETAILS PAGE
// ==========================================

const orderContainer = document.getElementById("order-details");

// ==========================================
// GET ORDER ID
// ==========================================

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

// ==========================================
// CHECK ORDER ID
// ==========================================

if (!orderId) {
    window.location.href = "orders.html";
}

// ==========================================
// LOAD ORDER
// ==========================================

async function loadOrder() {

    try {

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "../login.html";
            return;
        }

        const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            orderContainer.innerHTML = `
                <div class="order-card">
                    <h2>Order Not Found</h2>
                    <p>${data.message || "Unable to fetch order."}</p>
                    <br>
                    <a href="orders.html" class="back-btn">
                        Back to Orders
                    </a>
                </div>
            `;
            return;
        }

        displayOrder(data.order);

    }
    catch (error) {
        console.error("ORDER DETAILS ERROR:", error);

        orderContainer.innerHTML = `
            <div class="order-card">
                <h2>Something went wrong.</h2>
                <p>Please try again later.</p>
            </div>
        `;
    }

}

// ==========================================
// DISPLAY ORDER
// ==========================================

function displayOrder(order) {

    const date = new Date(order.createdAt);
    const status = order.orderStatus || "Pending";
    const statusClass = status.toLowerCase().replace(/\s+/g, "-");
    const address = order.shippingAddress || {};

    let productsHTML = "";

    (order.items || []).forEach(item => {

        const product = item.product || {};

        productsHTML += `
        <div class="product-item">
            <div class="product-left">
                <img
                    src="${product.images?.[0] || "../images/no-image.png"}"
                    alt="${product.name || "Product"}">
                <div class="product-details">
                    <h3>${product.name || "Product"}</h3>
                    <p>SKU : ${product._id?.slice(-6) || "N/A"}</p>
                    <p>Unit Price : ₹${item.price}</p>
                    <p>Quantity : ${item.quantity}</p>
                </div>
            </div>
            <div class="product-price">
                <h4>Subtotal</h4>
                <h2>₹${item.price * item.quantity}</h2>
            </div>
        </div>
        `;

    });

    const totalAmount = (order.items || []).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    orderContainer.innerHTML = `
        <div class="order-card">

            <div class="order-header">
                <h2>Order #${order._id?.slice(-8) || "N/A"}</h2>
                <span class="status-badge status-${statusClass}">${status}</span>
            </div>

            <p class="order-date">
                Placed on : ${date.toLocaleDateString()} ${date.toLocaleTimeString()}
            </p>

            <div class="shipping-address">
                <h3>Shipping Address</h3>
                <p>${address.fullName || ""}</p>
                <p>${address.addressLine || ""}</p>
                <p>${address.city || ""}, ${address.state || ""} - ${address.pincode || ""}</p>
                <p>Phone : ${address.phone || "N/A"}</p>
            </div>

            <div class="products-list">
                ${productsHTML}
            </div>

            <div class="order-total">
                <h3>Total Amount</h3>
                <h2>₹${totalAmount}</h2>
            </div>

            <div class="order-actions">
                <button class="track-btn" onclick="printInvoice()">
                    Print Invoice
                </button>
                <a href="orders.html" class="back-btn">
                    Back to Orders
                </a>
            </div>

        </div>
    `;

}

// ==========================================
// PRINT INVOICE
// ==========================================

function printInvoice() {
    window.print();
}

// ==========================================
// PAGE LOAD
// ==========================================

loadOrder();