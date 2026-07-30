/* ==========================================
   SAHU ENTERPRISES
   ADMIN ORDER DETAILS
   PART 3.1A
========================================== */

// ==========================================
// CONFIG
// ==========================================

const token = localStorage.getItem("token");

const orderSection = document.getElementById("order-details");

const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");

// ==========================================
// AUTH CHECK
// ==========================================

if (!token) {

    alert("Please login first.");

    window.location.href = "../login.html";

    throw new Error("No Token");

}

// ==========================================
// IMAGE HELPER
// ==========================================

function getProductImage(product) {

    if (!product) {

        return "../../images/no-image.png";

    }

    if (product.images && product.images.length > 0) {

        const img = product.images[0];

        if (img.startsWith("http")) {

            return img;

        }

        return `${BASE_URL.replace("/api", "")}/${img}`;

    }

    return "../../images/no-image.png";

}

// ==========================================
// MONEY FORMAT
// ==========================================

function formatPrice(value) {

    return Number(value || 0).toLocaleString("en-IN", {

        style: "currency",

        currency: "INR"

    });

}

// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {

        dateStyle: "medium",

        timeStyle: "short"

    });

}

// ==========================================
// STATUS BADGE
// ==========================================

function getStatusClass(status) {

    switch ((status || "").toLowerCase()) {

        case "confirmed":
            return "confirmed";

        case "pending":
            return "pending";

        case "shipped":
            return "shipped";

        case "delivered":
            return "delivered";

        case "cancelled":
            return "cancelled";

        default:
            return "pending";

    }

}

// ==========================================
// LOADING
// ==========================================

function showLoading() {

    orderSection.innerHTML = `

        <div class="loading">

            <div class="loader"></div>

            <h2>Loading Order...</h2>

            <p>Please wait.</p>

        </div>

    `;

}

// ==========================================
// ERROR
// ==========================================

function showError(message) {

    orderSection.innerHTML = `

        <div class="empty-state">

            <i class="fas fa-circle-exclamation fa-4x"></i>

            <h2>Unable to Load Order</h2>

            <p>${message}</p>

        </div>

    `;

}

// ==========================================
// FETCH ORDER
// ==========================================

async function fetchOrder() {

    if (!orderId) {

        showError("Order ID Missing");

        return;

    }

    showLoading();

    try {

        const response = await fetch(

            `${BASE_URL}/orders/${orderId}`,

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(

                data.message ||

                "Unable to fetch order."

            );

        }

        // FIX: the API responds with { success, order: {...} }.
        // Previously this passed the whole response body into
        // renderOrder(), so order.user / order.shippingAddress /
        // order.payment / order.items were all undefined and
        // order._id.slice(...) threw. Fall back to `data` only if
        // the backend ever responds with the order at the top level.

        renderOrder(data.order || data);

    }

    catch (error) {

        console.error(error);

        showError(error.message);

    }

}

// ==========================================
// SIDEBAR TOGGLE (mobile)
// ==========================================

function toggleSidebar() {

    const sidebar = document.querySelector(".sidebar");

    let overlay = document.querySelector(".sidebar-overlay");

    if (!overlay) {

        overlay = document.createElement("div");

        overlay.className = "sidebar-overlay";

        overlay.addEventListener("click", closeSidebar);

        document.body.appendChild(overlay);

    }

    sidebar.classList.toggle("show");

    overlay.classList.toggle("show");

}

function closeSidebar() {

    document.querySelector(".sidebar")?.classList.remove("show");

    document.querySelector(".sidebar-overlay")?.classList.remove("show");

}

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(

    "DOMContentLoaded",

    fetchOrder

);
/* ==========================================
   PART 3.1B-1
   MAIN ORDER LAYOUT
========================================== */

function renderOrder(order) {

    const customer = order.user || {};

    const shipping = order.shippingAddress || {};

    const payment = order.payment || {};

    const products = order.items || order.products || [];

    const subtotal = order.subtotal || order.totalAmount || order.total || 0;

    const shippingCharge = order.shippingCharge || 0;

    const tax = order.tax || 0;

    const discount = order.discount || 0;

    const grandTotal =
        order.totalAmount ||
        order.total ||
        (
            subtotal +
            shippingCharge +
            tax -
            discount
        );

    orderSection.innerHTML = `

    <div class="order-card fade-up">

        <div class="order-header">

            <div>

                <h2>#${order._id.slice(-8).toUpperCase()}</h2>

                <p>

                    Placed on ${formatDate(order.createdAt)}

                </p>

            </div>

            <div class="order-status ${getStatusClass(order.orderStatus)}">

                ${order.orderStatus || "Pending"}

            </div>

        </div>

        <div class="order-info">

            ${renderCustomerCard(customer)}

            ${renderShippingCard(shipping)}

            ${renderPaymentCard(payment, grandTotal)}

        </div>

        <div class="order-content">

            <div>

                ${renderProducts(products)}

            </div>

            <div>

                ${renderSummary({

                    subtotal,

                    shippingCharge,

                    tax,

                    discount,

                    grandTotal

                })}

            </div>

        </div>

        ${renderShippingLabel(order)}

        <div class="info-bar">

            <i class="fas fa-circle-info"></i>

            <span>

                Order ID :
                ${order._id}

            </span>

        </div>

    </div>

    `;

}
/* ==========================================
   PART 3.1B-2
   CUSTOMER • SHIPPING • PAYMENT CARDS
========================================== */

// ==========================================
// CUSTOMER CARD
// ==========================================

function renderCustomerCard(customer) {

    return `

        <div class="info-box customer-box">

            <div class="info-icon">

                <i class="fas fa-user"></i>

            </div>

            <h3>

                Customer

            </h3>

            <p>

                <strong>Name</strong>

                <span>

                    ${customer.name || "-"}

                </span>

            </p>

            <p>

                <strong>Email</strong>

                <span>

                    ${customer.email || "-"}

                </span>

            </p>

            <p>

                <strong>Phone</strong>

                <span>

                    ${customer.phone || "-"}

                </span>

            </p>

            <p>

                <strong>Customer ID</strong>

                <span>

                    ${customer._id || "-"}

                </span>

            </p>

        </div>

    `;

}

// ==========================================
// SHIPPING CARD
// ==========================================

function renderShippingCard(address) {

    return `

        <div class="info-box address-box">

            <div class="info-icon">

                <i class="fas fa-location-dot"></i>

            </div>

            <h3>

                Shipping

            </h3>

            <p>

                <strong>Receiver</strong>

                <span>

                    ${address.fullName || address.name || "-"}

                </span>

            </p>

            <p>

                <strong>Phone</strong>

                <span>

                    ${address.phone || "-"}

                </span>

            </p>

            <p>

                <strong>Address</strong>

                <span>

                    ${address.address || "-"}

                </span>

            </p>

            <p>

                <strong>City</strong>

                <span>

                    ${address.city || "-"}

                </span>

            </p>

            <p>

                <strong>State</strong>

                <span>

                    ${address.state || "-"}

                </span>

            </p>

            <p>

                <strong>Pincode</strong>

                <span>

                    ${address.postalCode || address.pincode || "-"}

                </span>

            </p>

            <p>

                <strong>Country</strong>

                <span>

                    ${address.country || "India"}

                </span>

            </p>

        </div>

    `;

}

// ==========================================
// PAYMENT CARD
// ==========================================

function renderPaymentCard(payment, total) {

    const paymentMethod =
        payment.method ||
        payment.paymentMethod ||
        "Cash on Delivery";

    const paymentStatus =
        payment.status ||
        payment.paymentStatus ||
        "Pending";

    const transactionId =
        payment.transactionId ||
        payment.paymentId ||
        "-";

    return `

        <div class="info-box payment-box">

            <div class="info-icon">

                <i class="fas fa-credit-card"></i>

            </div>

            <h3>

                Payment

            </h3>

            <p>

                <strong>Method</strong>

                <span>

                    ${paymentMethod}

                </span>

            </p>

            <p>

                <strong>Status</strong>

                <span>

                    ${paymentStatus}

                </span>

            </p>

            <p>

                <strong>Transaction</strong>

                <span>

                    ${transactionId}

                </span>

            </p>

            <p>

                <strong>Amount</strong>

                <span>

                    ${formatPrice(total)}

                </span>

            </p>

        </div>

    `;

}
/* ==========================================
   PART 3.2
   PRODUCTS • SUMMARY • SHIPPING LABEL
========================================== */

// ==========================================
// PRODUCTS TABLE
// ==========================================

function renderProducts(products = []) {

    return `

    <div class="products-card">

        <div class="products-header">

            <h2>

                Ordered Products

            </h2>

            <span>

                ${products.length} Item(s)

            </span>

        </div>

        <table class="products-table">

            <thead>

                <tr>

                    <th>Product</th>

                    <th>Price</th>

                    <th>Qty</th>

                    <th>Subtotal</th>

                </tr>

            </thead>

            <tbody>

                ${products.map(renderProductRow).join("")}

            </tbody>

        </table>

    </div>

    `;

}

// ==========================================
// SINGLE PRODUCT ROW
// ==========================================

function renderProductRow(item) {

    const product = item.product || item;

    const image = getProductImage(product);

    const name =
        product.name ||
        product.title ||
        "Product";

    const sku =
        product.sku ||
        product._id ||
        "-";

    const quantity =
        item.quantity || 1;

    const price =
        item.price ||
        product.price ||
        0;

    const subtotal =
        quantity * price;

    return `

        <tr>

            <td>

                <div class="product-info">

                    <img
                        src="${image}"
                        class="product-image"
                        alt="${name}">

                    <div>

                        <div class="product-name">

                            ${name}

                        </div>

                        <div class="product-sku">

                            SKU : ${sku}

                        </div>

                    </div>

                </div>

            </td>

            <td class="price">

                ${formatPrice(price)}

            </td>

            <td>

                <div class="qty">

                    ${quantity}

                </div>

            </td>

            <td class="subtotal">

                ${formatPrice(subtotal)}

            </td>

        </tr>

    `;

}

// ==========================================
// ORDER SUMMARY
// ==========================================

function renderSummary(summary) {

    return `

    <div class="summary-card">

        <h2>

            Order Summary

        </h2>

        <div class="summary-row">

            <span>Subtotal</span>

            <strong>

                ${formatPrice(summary.subtotal)}

            </strong>

        </div>

        <div class="summary-row">

            <span>Shipping</span>

            <strong>

                ${formatPrice(summary.shippingCharge)}

            </strong>

        </div>

        <div class="summary-row">

            <span>Tax</span>

            <strong>

                ${formatPrice(summary.tax)}

            </strong>

        </div>

        <div class="summary-row">

            <span>Discount</span>

            <strong>

                - ${formatPrice(summary.discount)}

            </strong>

        </div>

        <div class="summary-row total">

            <span>Total</span>

            <strong>

                ${formatPrice(summary.grandTotal)}

            </strong>

        </div>

    </div>

    `;

}

// ==========================================
// SHIPPING LABEL
// ==========================================

function renderShippingLabel(order) {

    const address =
        order.shippingAddress || {};

    const customer =
        order.user || {};

    return `

    <div class="shipping-card">

        <h2>

            Shipping Label

        </h2>

        <div class="label-grid">

            <div class="label-box">

                <h3>

                    Sender

                </h3>

                <p>

                    <strong>Sahu Enterprises</strong>

                </p>

                <p>

                    Ranchi, Jharkhand

                </p>

                <p>

                    India

                </p>

            </div>

            <div class="label-box">

                <h3>

                    Receiver

                </h3>

                <p>

                    <strong>

                        ${address.fullName || customer.name || "-"}

                    </strong>

                </p>

                <p>

                    ${address.address || "-"}

                </p>

                <p>

                    ${address.city || ""},

                    ${address.state || ""}

                </p>

                <p>

                    ${address.postalCode || address.pincode || ""}

                </p>

                <p>

                    ${address.phone || customer.phone || "-"}

                </p>

            </div>

        </div>

        <div class="label-footer">

            <span>

                Order ID :
                ${order._id}

            </span>

            <span>

                ${formatDate(order.createdAt)}

            </span>

        </div>

    </div>

    `;

}
/* ==========================================
   PART 3.3
   PRINT • EVENTS • IMAGE FALLBACK • FINAL
========================================== */

// ==========================================
// PRINT INVOICE
// ==========================================

function printInvoice() {

    window.print();

}

// ==========================================
// PRINT SHIPPING LABEL
// ==========================================

function printShippingLabel() {

    const label = document.querySelector(".shipping-card");

    if (!label) {

        alert("Shipping label not found.");

        return;

    }

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`

        <html>

        <head>

            <title>Shipping Label</title>

            <style>

                body{

                    font-family:Arial,sans-serif;

                    padding:40px;

                }

                .shipping-card{

                    border:2px solid #000;

                    padding:25px;

                    border-radius:12px;

                }

                .label-grid{

                    display:grid;

                    grid-template-columns:1fr 1fr;

                    gap:25px;

                    margin-top:20px;

                }

                .label-box{

                    border:1px solid #ddd;

                    padding:15px;

                }

                .label-footer{

                    margin-top:25px;

                    font-weight:bold;

                    display:flex;

                    justify-content:space-between;

                }

            </style>

        </head>

        <body>

            ${label.outerHTML}

        </body>

        </html>

    `);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

    printWindow.close();

}

// ==========================================
// IMAGE FALLBACK
// ==========================================

document.addEventListener("error", function (e) {

    if (e.target.tagName === "IMG") {

        e.target.src = "../../images/no-image.png";

    }

}, true);

// ==========================================
// BUTTON EVENTS
// ==========================================

document.addEventListener("click", function (e) {

    // Print Invoice

    if (e.target.closest("#printInvoiceBtn")) {

        printInvoice();

    }

    // Print Label

    if (e.target.closest("#printLabelBtn")) {

        printShippingLabel();

    }

    // Mobile sidebar toggle

    if (e.target.closest(".menu-btn")) {

        toggleSidebar();

    }

});

// ==========================================
// REFRESH ORDER (OPTIONAL)
// ==========================================

async function refreshOrder() {

    try {

        await fetchOrder();

    }

    catch (err) {

        console.error(err);

    }

}

// ==========================================
// AUTO REFRESH EVERY 60 SECONDS
// ==========================================

// Uncomment if needed

// setInterval(refreshOrder, 60000);

// ==========================================
// SUCCESS MESSAGE
// ==========================================

console.log(

    "%cSahu Enterprises Admin",

    "color:#2563eb;font-size:16px;font-weight:bold"

);

console.log(

    "%cOrder Details Loaded Successfully",

    "color:#16a34a;font-size:14px"

);

// ==========================================
// END OF FILE
// ==========================================