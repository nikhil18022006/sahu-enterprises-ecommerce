// ==========================================
// SAHU ENTERPRISES
// MY ORDERS PAGE
// ==========================================

const ordersContainer = document.getElementById("orders-container");

// ==========================================
// LOAD ORDERS
// ==========================================

async function loadOrders() {

    try {

        const token = localStorage.getItem("token");

        if (!token) {

            window.location.href = "login.html";
            return;

        }

        const response = await fetch(
            `${BASE_URL}/orders/my-orders`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            ordersContainer.innerHTML = `
                <div class="empty-orders">
                    <h2>Unable to load orders</h2>
                    <p>${data.message || "Please try again later."}</p>
                </div>
            `;

            return;

        }

        const orders = data.orders;

        if (!orders || orders.length === 0) {

            ordersContainer.innerHTML = `
                <div class="empty-orders">

                    <h2>No Orders Found</h2>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                </div>
            `;

            return;

        }

        displayOrders(orders);

    }

    catch (error) {

        console.error(error);

        ordersContainer.innerHTML = `
            <div class="empty-orders">

                <h2>Something went wrong</h2>

                <p>Please try again later.</p>

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
// DISPLAY ORDERS
// ==========================================

function displayOrders(orders) {

    ordersContainer.innerHTML = "";

    orders.forEach(order => {

        let productsHTML = "";

        order.items.forEach(item => {

            productsHTML += `

                <p>

                    ${item.product.name}

                    ×

                    ${item.quantity}

                </p>

            `;

        });

        const orderDate = new Date(order.createdAt);

        ordersContainer.innerHTML += `

<div class="order-card">

    <div class="order-header">

        <div>

            <h3>

                #${order._id.slice(-8).toUpperCase()}

            </h3>

            <p>

                Placed on :
                ${orderDate.toLocaleDateString("en-IN")}

            </p>

        </div>

        <span class="status ${getStatusClass(order.orderStatus)}">

            ${order.orderStatus}

        </span>

    </div>

    <hr>

    <div class="order-details">

        <div>

            <strong>

                Products

            </strong>

            ${productsHTML}

        </div>

        <div>

            <strong>

                Payment

            </strong>

            <p>

                ${order.paymentMethod}

            </p>

        </div>

        <div>

            <strong>

                Total

            </strong>

            <p>

                ₹${order.totalAmount}

            </p>

        </div>

    </div>

    <div class="order-actions">

        <a
            href="order-details.html?id=${order._id}"
            class="details-btn">

            View Details

        </a>

        <a
            href="order-tracking.html?id=${order._id}"
            class="track-btn">

            Track Order

        </a>

    </div>

</div>

`;

    });

}

// ==========================================
// INIT
// ==========================================

loadOrders();