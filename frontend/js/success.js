// ==========================================
// SAHU ENTERPRISES
// SUCCESS PAGE
// ==========================================

console.log("Success Page Loaded");

// ==========================================
// GET LAST ORDER
// ==========================================

const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));

console.log(lastOrder);

// ==========================================
// SELECT ELEMENTS
// ==========================================

const orderIdElement = document.getElementById("order-id");
const orderDateElement = document.getElementById("order-date");
const paymentMethodElement = document.getElementById("payment-method");
const orderTotalElement = document.getElementById("order-total");

// ==========================================
// DISPLAY ORDER
// ==========================================

if (!lastOrder) {

    alert("No recent order found.");

    window.location.href = "shop.html";

} else {

    orderIdElement.textContent = lastOrder._id;

    orderDateElement.textContent =
        new Date(lastOrder.createdAt).toLocaleDateString("en-IN");

    paymentMethodElement.textContent =
        lastOrder.paymentMethod;

    orderTotalElement.textContent =
        "₹" + lastOrder.totalAmount;

}