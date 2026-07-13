// ==========================================
// SAHU ENTERPRISES
// ORDER DETAILS PAGE
// ==========================================

console.log(orderId);

console.log(orders);

console.log(order);

// ==========================================
// GET ORDER ID
// ==========================================

const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");

// ==========================================
// LOAD ORDERS
// ==========================================

const orders = JSON.parse(
    localStorage.getItem("orders")
) || [];

// ==========================================
// SELECT CONTAINER
// ==========================================

const orderContainer =
    document.getElementById("order-details");

// ==========================================
// FIND ORDER
// ==========================================

const order = orders.find(function (item) {

    return item.id === orderId;

});

// ==========================================
// ORDER NOT FOUND
// ==========================================

if (!order) {

    orderContainer.innerHTML = `

        <div class="order-card">

            <h2>Order Not Found</h2>

            <p>

                The requested order does not exist.

            </p>

            <br>

            <a href="orders.html"
               class="back-btn">

                Back to Orders

            </a>

        </div>

    `;

}

// ==========================================
// DISPLAY ORDER
// ==========================================

else {

    let productsHTML = "";

    order.items.forEach(function (item) {

        productsHTML += `

            <div class="product-item">

                <div class="product-left">

                    <img
                        src="${item.image}"
                        alt="${item.name}">

                    <div class="product-details">

                        <h3>

                            ${item.name}

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

            <!-- HEADER -->

            <div class="order-header">

                <div>

                    <h2>

                        ${order.id}

                    </h2>

                    <p>

                        Ordered on :
                        ${order.date}

                    </p>

                </div>

                <span
                    class="order-status processing">

                    Processing

                </span>

            </div>

            <!-- INFO -->

            <div class="order-info">

                <div class="info-box">

                    <h3>

                        Shipping Address

                    </h3>

                    <p>

                        ${order.customer}

                    </p>

                    <p>

                        ${order.phone}

                    </p>

                    <p>

                        ${order.address}

                    </p>

                    <p>

                        ${order.city},
                        ${order.state}

                    </p>

                    <p>

                        ${order.pincode}

                    </p>

                </div>

                <div class="info-box">

                    <h3>

                        Payment Details

                    </h3>

                    <p>

                        Payment Method

                    </p>

                    <p>

                        ${order.payment}

                    </p>

                    <br>

                    <p>

                        Email

                    </p>

                    <p>

                        ${order.email}

                    </p>

                </div>

            </div>

            <!-- PRODUCTS -->

            <div class="products">

                <h2>

                    Ordered Products

                </h2>

                ${productsHTML}

            </div>

            <!-- SUMMARY -->

            <div class="summary">

                <div class="summary-row">

                    <span>

                        Subtotal

                    </span>

                    <span>

                        ${order.total}

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

                        ${order.total}

                    </span>

                </div>

            </div>

            <!-- BUTTONS -->

            <div class="order-actions">

                <a
                    href="orders.html"
                    class="back-btn">

                    Back to Orders

                </a>

                <a
                    href="order-tracking.html?id=${order.id}"
                    class="track-btn">

                    Track Order

                </a>

            </div>

        </div>

    `;

}