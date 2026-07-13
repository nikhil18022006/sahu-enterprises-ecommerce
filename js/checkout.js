// ==========================================
// SAHU ENTERPRISES
// CHECKOUT PAGE
// ==========================================



// ==========================================
// LOAD CART & ORDERS
// ==========================================

const checkoutCart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// ==========================================
// LOGIN CHECK
// ==========================================

if (!currentUser) {

    alert("Please login first.");

    window.location.href = "login.html";

}

// ==========================================
// AUTO FILL USER DETAILS
// ==========================================

document.getElementById("full-name").value =
    currentUser.name || "";

document.getElementById("email").value =
    currentUser.email || "";

document.getElementById("phone").value =
    currentUser.phone || "";

document.getElementById("address").value =
    currentUser.address || "";

document.getElementById("city").value =
    currentUser.city || "";

document.getElementById("state").value =
    currentUser.state || "";

document.getElementById("pincode").value =
    currentUser.pincode || "";
// ==========================================
// SELECT ELEMENTS
// ==========================================

const checkoutItems = document.getElementById("checkout-items");
const subtotal = document.getElementById("subtotal");
const total = document.getElementById("total");
const placeOrderBtn = document.getElementById("place-order");

// ==========================================
// DISPLAY ORDER SUMMARY
// ==========================================

function displayCheckout() {

    if (!checkoutItems) return;

    checkoutItems.innerHTML = "";

    let grandTotal = 0;

    if (checkoutCart.length === 0) {

        checkoutItems.innerHTML = "<p>Your cart is empty.</p>";

        subtotal.textContent = "₹0";
        total.textContent = "₹0";

        return;

    }

    checkoutCart.forEach(function (product) {

        const itemTotal = product.price * product.quantity;

        grandTotal += itemTotal;

        checkoutItems.innerHTML += `
            <div class="summary-item">
                <span>${product.name} × ${product.quantity}</span>
                <span>₹${itemTotal}</span>
            </div>
        `;

    });

    subtotal.textContent = "₹" + grandTotal;
    total.textContent = "₹" + grandTotal;

}

displayCheckout();

// ==========================================
// PLACE ORDER
// ==========================================

if (placeOrderBtn) {

    placeOrderBtn.addEventListener("click", function () {

        const fullName = document.getElementById("full-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const city = document.getElementById("city").value.trim();
        const state = document.getElementById("state").value.trim();
        const pincode = document.getElementById("pincode").value.trim();

        const payment = document.querySelector(
            'input[name="payment"]:checked'
        );

        // Validation

        if (
            fullName === "" ||
            email === "" ||
            phone === "" ||
            address === "" ||
            city === "" ||
            state === "" ||
            pincode === ""
        ) {

            alert("Please fill all billing details.");
            return;

        }

        if (!payment) {

            alert("Please select a payment method.");
            return;

        }

        // Create Order

        const order = {

            id: "ORD" + Date.now(),

            customer: fullName,

            email: email,

            phone: phone,

            address: address,

            city: city,

            state: state,

            pincode: pincode,

            payment: payment.value,

            items: checkoutCart,

            total: grandTotal = total.textContent,

            date: new Date().toLocaleDateString()

        };

        // Save Order

        orders.push(order);

        localStorage.setItem(
            "orders",
            JSON.stringify(orders)
        );

        // Clear Cart

        localStorage.removeItem("cart");

        // Redirect

        alert("Order Placed Successfully!");

        setTimeout(function () {

            window.location.href = "success.html";

        }, 1000);

    });

}