// ==========================================
// SAHU ENTERPRISES
// SUCCESS PAGE
// ==========================================

console.log("Success Page Loaded");

// ==========================================
// LOAD ORDERS
// ==========================================

const orders = JSON.parse(localStorage.getItem("orders")) || [];

// ==========================================
// SELECT ELEMENTS
// ==========================================

const orderId = document.getElementById("order-id");
const orderDate = document.getElementById("order-date");
const paymentMethod = document.getElementById("payment-method");
const orderTotal = document.getElementById("order-total");

// ==========================================
// DISPLAY LATEST ORDER
// ==========================================

if (orders.length > 0) {

    const latestOrder = orders[orders.length - 1];

    orderId.textContent = latestOrder.id;

    orderDate.textContent = latestOrder.date;

    paymentMethod.textContent = latestOrder.payment;

    orderTotal.textContent = latestOrder.total;

} else {

    alert("No recent order found.");

    window.location.href = "shop.html";

}