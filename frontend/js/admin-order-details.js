// ==========================================
// SAHU ENTERPRISES
// ADMIN ORDER DETAILS
// ==========================================

const BASE_URL = "https://sahu-enterprises-ecommerce.onrender.com/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const orderContainer = document.getElementById("order-details");

// ==========================================
// AUTH CHECK
// ==========================================

if (!token || !user) {

    alert("Please login first.");

    window.location.href = "../login.html";

}

if (user.role !== "admin") {

    alert("Access Denied");

    window.location.href = "../login.html";

}

// ==========================================
// GET ORDER ID
// ==========================================

const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");

if (!orderId) {

    window.location.href = "orders.html";

}

// ==========================================
// LOAD ORDER
// ==========================================

async function loadOrder() {

    try {

        orderContainer.innerHTML = `

            <div class="loading">

                <h2>

                    Loading Order...

                </h2>

                <p>

                    Please wait while we fetch order details.

                </p>

            </div>

        `;

        const response = await fetch(

            `${BASE_URL}/orders/${orderId}`,

            {

                method: "GET",

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        if (!response.ok) {

            orderContainer.innerHTML = `

                <div class="empty-state">

                    <h2>

                        Order Not Found

                    </h2>

                    <p>

                        ${data.message || "Unable to fetch order."}

                    </p>

                    <br>

                    <a
                        href="orders.html"
                        class="back-btn">

                        Back to Orders

                    </a>

                </div>

            `;

            return;

        }

        displayOrder(data.order);

    }

    catch (error) {

        console.error("ORDER DETAILS ERROR:", error);

        orderContainer.innerHTML = `

            <div class="empty-state">

                <h2>

                    Something went wrong.

                </h2>

                <p>

                    Unable to load this order.

                </p>

            </div>

        `;

    }

}

// ==========================================
// DISPLAY ORDER
// ==========================================

function displayOrder(order) {

    const address = order.shippingAddress || {};

    const status = order.orderStatus || "Pending";

    const statusClass = status
        .toLowerCase()
        .replace(/\s+/g, "-");

    const orderDate = new Date(order.createdAt)
        .toLocaleDateString("en-IN", {

            day: "2-digit",

            month: "long",

            year: "numeric"

        });

    let productsHTML = "";

    (order.items || []).forEach(item => {

        const product = item.product || {};

        productsHTML += `        <div class="product-item">

            <div class="product-left">

                <img
                    src="${product.images?.[0] || "../images/no-image.png"}"
                    alt="${product.name || "Product"}">

                <div class="product-details">

                    <h3>

                        ${product.name || "Product"}

                    </h3>

                    <p>

                        SKU :
                        ${product._id?.slice(-6) || "N/A"}

                    </p>

                    <p>

                        Unit Price :
                        ₹${item.price}

                    </p>

                    <p>

                        Quantity :
                        ${item.quantity}

                    </p>

                </div>

            </div>

            <div class="product-price">

                <h4>

                    Subtotal

                </h4>

                <h2>

                    ₹${item.price * item.quantity}

                </h2>

            </div>

        </div>

        `;

    });

    orderContainer.innerHTML = `

    <div class="order-card">

        <!-- ORDER HEADER -->

        <div class="order-header">

            <div>

                <h2>

                    Order #${order._id.slice(-8)}

                </h2>

                <p>

                    Ordered on :
                    ${orderDate}

                </p>

            </div>

            <span class="order-status ${statusClass}">

                ${status}

            </span>

        </div>

        <!-- CUSTOMER / ADDRESS / PAYMENT -->

        <div class="order-info">

            <div class="info-box customer-box">

                <h3>

                    Customer Details

                </h3>

                <p>

                    <strong>Name :</strong>

                    ${order.user?.name || "N/A"}

                </p>

                <p>

                    <strong>Email :</strong>

                    ${order.user?.email || "N/A"}

                </p>

                <p>

                    <strong>Phone :</strong>

                    ${address.phone || "N/A"}

                </p>

            </div>

            <div class="info-box address-box">

                <h3>

                    Shipping Address

                </h3>

                <p>${address.fullName || ""}</p>

                <p>${address.phone || ""}</p>

                <p>${address.address || ""}</p>

                <p>

                    ${address.city || ""},
                    ${address.state || ""}

                </p>

                <p>

                    ${address.pincode || ""}

                </p>

                <p>

                    ${address.country || ""}

                </p>

            </div>

            <div class="info-box payment-box">

                <h3>

                    Payment Details

                </h3>

                <p>

                    <strong>Method :</strong>

                    ${order.paymentMethod}

                </p>

                <p>

                    <strong>Status :</strong>

                    ${order.paymentStatus || "Pending"}

                </p>

                <p>

                    <strong>Transaction :</strong>

                    ${order.razorpayPaymentId || "N/A"}

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

            <h2>

                Order Summary

            </h2>

            <div class="summary-row">

                <span>

                    Total Items

                </span>

                <span>

                    ${(order.items || []).length}

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

                    Payment

                </span>

                <span>

                    ${order.paymentMethod}

                </span>

            </div>

            <div class="summary-row total">

                <span>

                    Grand Total

                </span>

                <span>

                    ₹${order.totalAmount}

                </span>

            </div>

        </div>

        <!-- SHIPPING LABEL -->

        <div id="shipping-label" class="shipping-label">

            <h2>

                SHIPPING LABEL

            </h2>

            <div class="label-grid">

                <div class="label-box">

                    <h3>

                        FROM

                    </h3>

                    <p><strong>Sahu Enterprises</strong></p>

                    <p>Your Warehouse Address</p>

                    <p>Ranchi, Jharkhand</p>

                    <p>India</p>

                </div>

                <div class="label-box">

                    <h3>

                        TO

                    </h3>

                    <p>

                        <strong>${address.fullName || ""}</strong>

                    </p>

                    <p>${address.phone || ""}</p>

                    <p>${address.address || ""}</p>

                    <p>

                        ${address.city || ""}

                    </p>

                    <p>

                        ${address.state || ""}

                    </p>

                    <p>

                        ${address.pincode || ""}

                    </p>

                    <p>

                        ${address.country || ""}

                    </p>

                </div>

            </div>

            <div class="label-footer">

                <span>

                    Order :
                    ${order._id.slice(-8)}

                </span>

                <span>

                    Payment :
                    ${order.paymentMethod}

                </span>

            </div>

        </div>
                <!-- ===========================
             ACTION BUTTONS
        ============================ -->

        <div class="order-actions">

            <button
                class="print-label-btn"
                onclick="printShippingLabel()">

                🖨 Print Shipping Label

            </button>

            <button
                class="print-invoice-btn"
                onclick="printInvoice()">

                📄 Print Invoice

            </button>

            <a
                href="orders.html"
                class="back-btn">

                ← Back to Orders

            </a>

        </div>

    </div>

    `;

}

// ==========================================
// PRINT SHIPPING LABEL
// ==========================================

function printShippingLabel() {

    const label = document.getElementById("shipping-label").innerHTML;

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`

        <html>

        <head>

            <title>Shipping Label</title>

            <style>

                body{

                    font-family:Arial,sans-serif;

                    padding:30px;

                }

                h2{

                    text-align:center;

                    margin-bottom:30px;

                }

                .label-grid{

                    display:grid;

                    grid-template-columns:1fr 1fr;

                    gap:30px;

                }

                .label-box{

                    border:1px solid #000;

                    padding:15px;

                    border-radius:8px;

                }

                .label-box h3{

                    margin-bottom:15px;

                    border-bottom:1px solid #000;

                    padding-bottom:8px;

                }

                .label-footer{

                    margin-top:25px;

                    display:flex;

                    justify-content:space-between;

                    font-weight:bold;

                }

            </style>

        </head>

        <body>

            ${label}

        </body>

        </html>

    `);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

    printWindow.close();

}

// ==========================================
// PRINT COMPLETE PAGE AS INVOICE
// ==========================================

function printInvoice() {

    window.print();

}

// ==========================================
// PAGE LOAD
// ==========================================

loadOrder();