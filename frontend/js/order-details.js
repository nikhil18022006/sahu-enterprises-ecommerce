// ==========================================
// SAHU ENTERPRISES
// ORDER DETAILS PAGE
// ==========================================

const orderContainer = document.getElementById("order-details");

// ==========================================
// GET ORDER ID FROM URL
// ==========================================

const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");

// ==========================================
// LOAD ORDER
// ==========================================

async function loadOrder() {

    try {

        const token = localStorage.getItem("token");

        if (!token) {

            window.location.href = "login.html";

            return;

        }

        const response = await fetch(`${BASE_URL}/orders/${orderId}`, {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        if (!response.ok) {

            orderContainer.innerHTML = `

                <div class="order-card">

                    <h2>Order Not Found</h2>

                    <p>${data.message}</p>

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

        console.error(error);

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

    const statusClass = order.orderStatus
        .toLowerCase()
        .replace(/\s+/g, "-");

    let productsHTML = "";

    order.items.forEach(item => {

        const product = item.product ?? {};

        productsHTML += `

            <div class="product-item">

                <div class="product-left">

                    <img
                        src="${product.images?.[0] || "../images/no-image.png"}"
                        alt="${product.name || "Product"}">

                    <div class="product-details">

                        <h3>

                            ${product.name || "Product"}

                        </h3>

                        <p>

                            Quantity :
                            ${item.quantity}

                        </p>

                        <p>

                            ₹${item.price}

                        </p>

                    </div>

                </div>

                <div class="product-price">

                    <h3>

                        ₹${item.price * item.quantity}

                    </h3>

                </div>

            </div>

        `;

    });

    orderContainer.innerHTML = `

<div class="order-card">

    <div class="order-header">

        <div>

            <h2>

                Order #${order._id.slice(-8)}

            </h2>

            <p>

                Ordered on :
                ${date.toLocaleDateString("en-IN")}

            </p>

        </div>

        <span class="order-status ${statusClass}">

            ${order.orderStatus}

        </span>

    </div>

    <div class="order-info">

        <div class="info-box">

            <h3>

                Shipping Address

            </h3>

            <p>

                ${order.shippingAddress.fullName}

            </p>

            <p>

                ${order.shippingAddress.phone}

            </p>

            <p>

                ${order.shippingAddress.address}

            </p>

            <p>

                ${order.shippingAddress.city},
                ${order.shippingAddress.state}

            </p>

            <p>

                ${order.shippingAddress.pincode}

            </p>

            <p>

                ${order.shippingAddress.country}

            </p>

        </div>

        <div class="info-box">

            <h3>

                Payment Details

            </h3>

            <p>

                <strong>Method</strong>

            </p>

            <p>

                ${order.paymentMethod}

            </p>

            <br>

            <p>

                <strong>Status</strong>

            </p>

            <p>

                ${order.paymentStatus}

            </p>

        </div>

    </div>

    <div class="products">

        <h2>

            Ordered Products

        </h2>

        ${productsHTML}

    </div>

    <div class="summary">

        <div class="summary-row">

            <span>

                Subtotal

            </span>

            <span>

                ₹${order.totalAmount}

            </span>

        </div>

        <div class="summary-row">

            <span>

                Shipping

            </span>

            <span>

                FREE

            </span>

        </div>

        <div class="summary-row">

            <span>

                GST

            </span>

            <span>

                Included

            </span>

        </div>

        <div class="summary-row total">

            <span>

                Total

            </span>

            <span>

                ₹${order.totalAmount}

            </span>

        </div>

    </div>

    <div class="order-actions">

        <a
            href="orders.html"
            class="back-btn">

            Back to Orders

        </a>

    </div>

</div>

`;

}

// ==========================================

loadOrder();