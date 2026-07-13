// ==========================================
// AUTH CHECK
// ==========================================

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const protectedPages = [
    "checkout.html",
    "orders.html",
    "profile.html"
];

const currentPage = window.location.pathname.split("/").pop();

if (protectedPages.includes(currentPage) && !currentUser) {

    alert("Please login first.");

    window.location.href = "login.html";
}