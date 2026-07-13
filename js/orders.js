// ==========================================
// SAHU ENTERPRISES
// ORDERS PAGE
// ==========================================



// ==========================================
// LOAD USER & ORDERS
// ==========================================


const orders = JSON.parse(localStorage.getItem("orders")) || [];

const ordersContainer = document.getElementById("orders-container");

// ==========================================
// LOGIN CHECK
// ==========================================

if (!currentUser) {

    alert("Please login first.");

    window.location.href = "login.html";

}

// ==========================================
// FILTER USER ORDERS
// ==========================================

console.log("Current User:", currentUser);

console.log("All Orders:", orders);

const userOrders = orders.filter(function (order) {

    return order.email === currentUser.email;

});

console.log("User Orders:", userOrders);
// ==========================================
// NO ORDERS
// ==========================================

if (userOrders.length === 0) {

    ordersContainer.innerHTML = `
        <h2>No Orders Found</h2>
        <p>You haven't placed any orders yet.</p>
    `;

} else {

    userOrders.reverse().forEach(function (order) {

        let products = "";

        order.items.forEach(function (item) {

            products += `
                <p>
                    ${item.name} × ${item.quantity}
                </p>
            `;

        });

        ordersContainer.innerHTML += `

<div class="order-card">

    <div class="order-header">

        <div>

            <h3>${order.id}</h3>

            <p>Placed on: ${order.date}</p>

        </div>

        <span class="status processing">

            Processing

        </span>

    </div>

    <hr>

    <div class="order-details">

        <div>

            <strong>Products</strong>

            ${products}

        </div>

        <div>

            <strong>Payment</strong>

            <p>${order.payment}</p>

        </div>

        <div>

            <strong>Total</strong>

            <p>${order.total}</p>

        </div>

    </div>

    <div class="order-actions">

        <a
            href="order-details.html?id=${order.id}"
            class="view-order">

            View Details

        </a>

        <a
            href="order-tracking.html?id=${order.id}"
            class="track-order">

            Track Order

        </a>

    </div>

</div>

`;

    });

}