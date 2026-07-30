// ==========================================
// SAHU ENTERPRISES
// ORDER TRACKING
// ==========================================

document.addEventListener("DOMContentLoaded", loadOrderTracking);

// ==========================================
// LOAD ORDER
// ==========================================

async function loadOrderTracking() {

    const container =
        document.getElementById("tracking-container");

    if (!container) return;

    container.innerHTML = `
        <div class="loading">
            <h2>Loading Order...</h2>
            <p>Please wait while we fetch your order.</p>
        </div>
    `;

    try {

        const token =
            localStorage.getItem("token");

        if (!token) {

            window.location.href = "login.html";
            return;

        }

        const params =
            new URLSearchParams(window.location.search);

        const orderId =
            params.get("id");

        if (!orderId) {

            container.innerHTML = `
                <div class="tracking-card">

                    <h2>Invalid Order</h2>

                    <p>No order id provided.</p>

                    <br>

                    <a href="orders.html"
                       class="back-btn">

                        Back to Orders

                    </a>

                </div>
            `;

            return;

        }

        const response = await fetch(

            `${BASE_URL}/orders/${orderId}`,

            {

                method: "GET",

                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }

        );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(

                data.message ||
                "Unable to load order."

            );

        }

        const order =
            data.order;

        renderTracking(order);

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `

            <div class="tracking-card">

                <h2>

                    Failed to Load Order

                </h2>

                <p>

                    ${error.message}

                </p>

                <br>

                <a href="orders.html"
                   class="back-btn">

                    Back to Orders

                </a>

            </div>

        `;

    }

}

// ==========================================
// STATUS CLASS
// ==========================================

function getStatusClass(status) {

    switch (status) {

        case "Pending":

            return "processing";

        case "Confirmed":

            return "confirmed";

        case "Packed":

            return "packed";

        case "Shipped":

            return "shipped";

        case "Out for Delivery":

            return "delivery";

        case "Delivered":

            return "delivered";

        case "Cancelled":

            return "cancelled";

        default:

            return "processing";

    }

}

// ==========================================
// TIMELINE STATUS
// ==========================================

function getTimeline(status) {

    const steps = [

        "Pending",

        "Confirmed",

        "Packed",

        "Shipped",

        "Out for Delivery",

        "Delivered"

    ];

    const current =
        steps.indexOf(status);

    return steps.map((step, index) => {

        let state = "";

        if (index < current) {

            state = "completed";

        }

        else if (index === current) {

            state = "active";

        }

        return {

            title: step,

            state

        };

    });

}
// ==========================================
// RENDER TRACKING PAGE
// ==========================================

function renderTracking(order) {

    const container =
        document.getElementById("tracking-container");

    const timeline =
        getTimeline(order.orderStatus);

    const address =
        order.shippingAddress;

    const orderedDate =
        new Date(order.createdAt)
            .toLocaleDateString("en-IN", {

                day: "numeric",
                month: "long",
                year: "numeric"

            });

    const products =
        order.items.map(item => {

            const product = item.product || {};

            return `

                <div class="ordered-product">

                    <img
                        src="${product.images?.[0] || "../images/no-image.png"}"
                        alt="${product.name || "Product"}">

                    <div class="ordered-product-info">

                        <h4>

                            ${product.name || "Deleted Product"}

                        </h4>

                        <p>

                            Quantity :
                            ${item.quantity}

                        </p>

                        <p>

                            ₹${item.price}

                        </p>

                    </div>

                </div>

            `;

        }).join("");

    const timelineHTML =
        timeline.map(step => {

            return `

                <div class="timeline-item ${step.state}">

                    <div class="timeline-icon">

                        ✓

                    </div>

                    <div class="timeline-content">

                        <h3>

                            ${step.title}

                        </h3>

                    </div>

                </div>

            `;

        }).join("");

    container.innerHTML = `

<div class="tracking-card">

    <div class="tracking-header">

        <div>

            <h2>

                Order #${order._id.slice(-8).toUpperCase()}

            </h2>

            <p>

                Ordered on ${orderedDate}

            </p>

        </div>

        <span class="status ${getStatusClass(order.orderStatus)}">

            ${order.orderStatus}

        </span>

    </div>

    <div class="timeline">

        ${timelineHTML}

    </div>

    <div class="delivery-box">

        <h3>

            Shipping Address

        </h3>

        <p>

            <strong>${address.fullName}</strong>

        </p>

        <p>

            ${address.phone}

        </p>

        <p>

            ${address.address}

        </p>

        <p>

            ${address.city},
            ${address.state}

        </p>

        <p>

            ${address.pincode},
            ${address.country}

        </p>

    </div>

    <br>

    <div class="delivery-box">

        <h3>

            Payment Details

        </h3>

        <p>

            Payment Method :
            <strong>

                ${order.paymentMethod}

            </strong>

        </p>

        <p>

            Payment Status :
            <strong>

                ${order.paymentStatus}

            </strong>

        </p>

        <p>

            Total Amount :
            <strong>

                ₹${order.totalAmount}

            </strong>

        </p>

    </div>

    <br>

    <div class="delivery-box">

        <h3>

            Ordered Products

        </h3>

        ${products}

    </div>

    <div class="tracking-actions">

        <a
            href="orders.html"
            class="back-btn">

            Back to Orders

        </a>

        <a
            href="order-details.html?id=${order._id}"
            class="details-btn">

            View Order Details

        </a>

    </div>

</div>

`;

}