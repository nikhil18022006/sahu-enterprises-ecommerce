// ==========================================
// SAHU ENTERPRISES
// ADMIN ORDER DETAILS
// PART 3.1
// ==========================================

// Authentication

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const orderContainer = document.getElementById("order-details");

// Redirect if not logged in

if (!token || !user) {

    alert("Please login first.");

    window.location.href = "../login.html";

}

// Allow only admin

if (user.role !== "admin") {

    alert("Access Denied");

    window.location.href = "../login.html";

}

// Get Order ID

const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");

if (!orderId) {

    window.location.href = "orders.html";

}

// ==========================================
// Helper Functions
// ==========================================

// Safe image URL

function getProductImage(product){

    if(product?.images?.length){

        const img = product.images[0];

        if(img.startsWith("http")){

            return img;

        }

        return `${BASE_URL.replace("/api","")}/${img}`;

    }

    return "../../images/no-image.png";

}

// Format Date

function formatDate(date){

    return new Date(date).toLocaleDateString("en-IN",{

        day:"2-digit",

        month:"long",

        year:"numeric"

    });

}

// Currency

function money(amount){

    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;

}

// ==========================================
// Load Order
// ==========================================

async function loadOrder(){

    orderContainer.innerHTML = `

        <div class="loading">

            <div class="loader"></div>

            <h2>Loading Order...</h2>

            <p>Please wait...</p>

        </div>

    `;

    try{

        const response = await fetch(

            `${BASE_URL}/orders/${orderId}`,

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        if(!response.ok){

            throw new Error(data.message || "Unable to fetch order");

        }

        renderOrder(data.order);

    }

    catch(error){

        console.error(error);

        orderContainer.innerHTML=`

            <div class="empty-state">

                <h2>Order Not Found</h2>

                <p>${error.message}</p>

                <a href="orders.html" class="back-btn">

                    ← Back to Orders

                </a>

            </div>

        `;

    }

}
// ==========================================
// PART 3.2
// RENDER ORDER
// ==========================================

function renderOrder(order){

    const address = order.shippingAddress || {};

    const status = order.orderStatus || "Pending";

    const statusClass = status.toLowerCase().replace(/\s+/g,"-");

    let productsHTML = "";

    (order.items || []).forEach(item=>{

        const product = item.product || {};

        productsHTML += `

        <div class="product-item">

            <div class="product-left">

                <img
                    src="${getProductImage(product)}"
                    alt="${product.name || "Product"}"
                    onerror="this.src='../../images/no-image.png'">

                <div class="product-details">

                    <h3>${product.name || "Product"}</h3>

                    <p>
                        SKU :
                        ${product._id?.slice(-6) || "N/A"}
                    </p>

                    <p>
                        Unit Price :
                        ${money(item.price)}
                    </p>

                    <p>
                        Quantity :
                        ${item.quantity}
                    </p>

                </div>

            </div>

            <div class="product-price">

                <h4>Subtotal</h4>

                <h2>${money(item.price * item.quantity)}</h2>

            </div>

        </div>

        `;

    });

    orderContainer.innerHTML = `

    <div class="order-card">

        <!-- Header -->

        <div class="order-header">

            <div>

                <h2>

                    Order #${order._id.slice(-8)}

                </h2>

                <p>

                    Ordered on ${formatDate(order.createdAt)}

                </p>

            </div>

            <span class="order-status ${statusClass}">

                ${status}

            </span>

        </div>

        <!-- Info -->

        <div class="order-info">

            <!-- Customer -->

            <div class="info-box customer-box">

                <h3>Customer Details</h3>

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

            <!-- Shipping -->

            <div class="info-box address-box">

                <h3>Shipping Address</h3>

                <p>${address.fullName || ""}</p>

                <p>${address.phone || ""}</p>

                <p>${address.address || ""}</p>

                <p>

                    ${address.city || ""},

                    ${address.state || ""}

                </p>

                <p>${address.pincode || ""}</p>

                <p>${address.country || ""}</p>

            </div>

            <!-- Payment -->

            <div class="info-box payment-box">

                <h3>Payment Details</h3>

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

        <!-- Products -->

        <div class="products">

            <h2>Ordered Products</h2>

            ${productsHTML}

        </div>

        <!-- Summary -->

        <div class="summary">

            <h2>Order Summary</h2>

            <div class="summary-row">

                <span>Total Items</span>

                <span>${order.items.length}</span>

            </div>

            <div class="summary-row">

                <span>Shipping</span>

                <span>FREE</span>

            </div>

            <div class="summary-row">

                <span>Payment</span>

                <span>${order.paymentMethod}</span>

            </div>

            <div class="summary-row total">

                <span>Grand Total</span>

                <span>${money(order.totalAmount)}</span>

            </div>

        </div>

        <div id="shipping-label" class="shipping-label">

            <h2>Shipping Label</h2>

        </div>

        <div class="order-actions">

            <button
                class="btn success-btn"
                id="printLabel">

                🖨 Print Label

            </button>

            <button
                class="btn primary-btn"
                id="printInvoice">

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
// PART 3.3
// SHIPPING LABEL + PRINT + EVENTS
// ==========================================

function updateShippingLabel(order){

    const address = order.shippingAddress || {};

    const label = document.getElementById("shipping-label");

    if(!label) return;

    label.innerHTML = `

        <h2>SHIPPING LABEL</h2>

        <div class="label-grid">

            <div class="label-box">

                <h3>FROM</h3>

                <p><strong>Sahu Enterprises</strong></p>

                <p>Ranchi</p>

                <p>Jharkhand</p>

                <p>India</p>

            </div>

            <div class="label-box">

                <h3>TO</h3>

                <p><strong>${address.fullName || ""}</strong></p>

                <p>${address.phone || ""}</p>

                <p>${address.address || ""}</p>

                <p>${address.city || ""}, ${address.state || ""}</p>

                <p>${address.pincode || ""}</p>

                <p>${address.country || ""}</p>

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

    `;

}

// ==========================================
// PRINT SHIPPING LABEL
// ==========================================

function printShippingLabel(){

    const label = document.getElementById("shipping-label");

    if(!label) return;

    const win = window.open("", "_blank");

    win.document.write(`

        <html>

        <head>

            <title>Shipping Label</title>

            <style>

                body{

                    font-family:Arial,sans-serif;

                    padding:30px;

                }

                .label-grid{

                    display:grid;

                    grid-template-columns:1fr 1fr;

                    gap:25px;

                }

                .label-box{

                    border:1px solid #333;

                    padding:15px;

                }

                .label-footer{

                    margin-top:20px;

                    display:flex;

                    justify-content:space-between;

                    font-weight:bold;

                }

            </style>

        </head>

        <body>

            ${label.innerHTML}

        </body>

        </html>

    `);

    win.document.close();

    win.focus();

    win.print();

    win.close();

}

// ==========================================
// PRINT COMPLETE PAGE
// ==========================================

function printInvoice(){

    window.print();

}

// ==========================================
// BUTTON EVENTS
// ==========================================

document.addEventListener("click",(e)=>{

    if(e.target.id==="printLabel"){

        printShippingLabel();

    }

    if(e.target.id==="printInvoice"){

        printInvoice();

    }

});

// ==========================================
// PATCH renderOrder()
// ==========================================
//
// Inside renderOrder(order),
// after:
//
// orderContainer.innerHTML = `...`;
//
// ADD THIS LINE:
//
// updateShippingLabel(order);
//
// ==========================================

// ==========================================
// INITIAL LOAD
// ==========================================

loadOrder();