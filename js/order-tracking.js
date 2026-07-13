// ==========================================
// SAHU ENTERPRISES
// ORDER TRACKING PAGE
// ==========================================

// ==========================================
// GET ORDER ID
// ==========================================

const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");

// ==========================================
// LOAD ORDERS
// ==========================================

const orders =
    JSON.parse(localStorage.getItem("orders")) || [];

// ==========================================
// SELECT CONTAINER
// ==========================================

const trackingContainer =
    document.getElementById("tracking-container");

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

    trackingContainer.innerHTML = `

        <div class="tracking-card">

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
// DEFAULT STATUS
// ==========================================

else {

    const status = order.status || "Processing";

    let placed = "";
    let confirmed = "";
    let packed = "";
    let shipped = "";
    let out = "";
    let delivered = "";

    switch (status.toLowerCase()) {

        case "processing":

            placed = "completed";
            confirmed = "active";
            break;

        case "packed":

            placed = "completed";
            confirmed = "completed";
            packed = "active";
            break;

        case "shipped":

            placed = "completed";
            confirmed = "completed";
            packed = "completed";
            shipped = "active";
            break;

        case "out for delivery":

            placed = "completed";
            confirmed = "completed";
            packed = "completed";
            shipped = "completed";
            out = "active";
            break;

        case "delivered":

            placed = confirmed = packed =
            shipped = out = delivered = "completed";
            break;

        default:

            placed = "completed";
            confirmed = "active";

    }

    trackingContainer.innerHTML = `

        <div class="tracking-card">

            <div class="tracking-header">

                <div>

                    <h2>

                        ${order.id}

                    </h2>

                    <p>

                        Ordered on :
                        ${order.date}

                    </p>

                </div>

                <span class="status processing">

                    ${status}

                </span>

            </div>

            <div class="timeline">

                <div class="timeline-item ${placed}">

                    <div class="timeline-icon">✓</div>

                    <div class="timeline-content">

                        <h3>Order Placed</h3>

                        <p>Your order has been placed successfully.</p>

                    </div>

                </div>

                <div class="timeline-item ${confirmed}">

                    <div class="timeline-icon">✓</div>

                    <div class="timeline-content">

                        <h3>Order Confirmed</h3>

                        <p>Your payment/order has been confirmed.</p>

                    </div>

                </div>

                <div class="timeline-item ${packed}">

                    <div class="timeline-icon">✓</div>

                    <div class="timeline-content">

                        <h3>Packed</h3>

                        <p>Your order is packed and ready.</p>

                    </div>

                </div>

                <div class="timeline-item ${shipped}">

                    <div class="timeline-icon">✓</div>

                    <div class="timeline-content">

                        <h3>Shipped</h3>

                        <p>Your package has left the warehouse.</p>

                    </div>

                </div>

                <div class="timeline-item ${out}">

                    <div class="timeline-icon">✓</div>

                    <div class="timeline-content">

                        <h3>Out For Delivery</h3>

                        <p>Your package is on the way.</p>

                    </div>

                </div>

                <div class="timeline-item ${delivered}">

                    <div class="timeline-icon">✓</div>

                    <div class="timeline-content">

                        <h3>Delivered</h3>

                        <p>Package delivered successfully.</p>

                    </div>

                </div>

            </div>

            <div class="delivery-box">

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

                <br>

                <h3>

                    Payment

                </h3>

                <p>

                    ${order.payment}

                </p>

            </div>

            <div class="tracking-actions">

                <a
                    href="order-details.html?id=${order.id}"
                    class="details-btn">

                    Order Details

                </a>

                <a
                    href="orders.html"
                    class="back-btn">

                    Back to Orders

                </a>

            </div>

        </div>

    `;

}