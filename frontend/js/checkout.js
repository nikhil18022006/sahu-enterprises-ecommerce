// ==========================================
// SAHU ENTERPRISES
// CHECKOUT PAGE
// ==========================================
// Wrapped in an IIFE so top-level variables (currentUser, token, etc.)
// can't collide with the same names in another <script> on the page,
// and so this file is safe even if it accidentally gets included twice.

(function () {

    let currentUser = null;

    try {
        currentUser = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        console.error("Failed to parse stored user:", error);
        currentUser = null;
    }

    const token = localStorage.getItem("token");

    // ==========================================
    // LOGIN CHECK
    // ==========================================
    // FIX: previously this redirected but did NOT stop script execution,
    // so the code below tried to read currentUser.name on a null object
    // and crashed before the redirect could even take effect.

    if (!currentUser || !token) {

        alert("Please login first.");

        window.location.href = "login.html";

        // Stop the rest of the script from running.
        throw new Error("User not authenticated - redirecting to login.");

    }

    // ==========================================
    // AUTO FILL USER DETAILS
    // ==========================================

    function setFieldValue(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.value = value || "";
        }
    }

    setFieldValue("full-name", currentUser.name);
    setFieldValue("email", currentUser.email);
    setFieldValue("phone", currentUser.phone);
    setFieldValue("address", currentUser.address);
    setFieldValue("city", currentUser.city);
    setFieldValue("state", currentUser.state);
    setFieldValue("pincode", currentUser.pincode);

    // ==========================================
    // SELECT ELEMENTS
    // ==========================================

    const checkoutItems = document.getElementById("checkout-items");
    const subtotal = document.getElementById("subtotal");
    const total = document.getElementById("total");
    const placeOrderBtn = document.getElementById("place-order");

    // ==========================================
    // LOAD CART & ORDERS
    // ==========================================

    let checkoutCart = [];

    async function loadCheckoutCart() {

        try {

            const response = await fetch(`${BASE_URL}/cart`, {

                headers: {
                    Authorization: `Bearer ${token}`
                }

            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) {

                alert(data.message);
                return;

            }

            checkoutCart = data.cart?.items || [];
            console.log("Checkout Cart:", checkoutCart);

            displayCheckout();

        } catch (error) {

            console.error(error);
            alert("Could not load your cart. Please refresh and try again.");

        }

    }

    // ==========================================
    // DISPLAY ORDER SUMMARY
    // ==========================================

    function displayCheckout() {

        if (!checkoutItems) return;

        checkoutItems.innerHTML = "";

        let grandTotal = 0;

        if (checkoutCart.length === 0) {

            checkoutItems.innerHTML = "<p>Your cart is empty.</p>";

            if (subtotal) subtotal.textContent = "₹0";
            if (total) total.textContent = "₹0";

            return;

        }

        checkoutCart.forEach(function (item) {

            const product = item.product;

            if (!product) return;

            const itemTotal = product.price * item.quantity;

            grandTotal += itemTotal;

            checkoutItems.innerHTML += `
        <div class="summary-item">
            <span>${product.name} × ${item.quantity}</span>
            <span>₹${itemTotal}</span>
        </div>
    `;

        });

        if (subtotal) subtotal.textContent = "₹" + grandTotal;
        if (total) total.textContent = "₹" + grandTotal;

    }

    loadCheckoutCart();

    // ==========================================
    // PLACE ORDER
    // ==========================================

    if (placeOrderBtn) {

        placeOrderBtn.addEventListener("click", async function () {

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

            // ==========================================
            // VALIDATION
            // ==========================================

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

            // Basic sanity checks so obviously malformed input doesn't hit the server.
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            const phonePattern = /^\d{10}$/;
            if (!phonePattern.test(phone)) {
                alert("Please enter a valid 10-digit phone number.");
                return;
            }

            const pincodePattern = /^\d{6}$/;
            if (!pincodePattern.test(pincode)) {
                alert("Please enter a valid 6-digit pincode.");
                return;
            }

            if (!payment) {
                alert("Please select a payment method.");
                return;
            }

            if (checkoutCart.length === 0) {
                alert("Your cart is empty.");
                return;
            }

            // Disable the button to prevent double-submission while the request is in flight.
            placeOrderBtn.disabled = true;

            try {

                // ==========================================
                // CASH ON DELIVERY
                // ==========================================

                if (payment.value === "COD") {

                    const response = await fetch(`${BASE_URL}/orders`, {

                        method: "POST",

                        headers: {

                            "Content-Type": "application/json",

                            Authorization: `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            shippingAddress: {
                                fullName,
                                email,
                                phone,
                                address,
                                city,
                                state,
                                pincode
                            },

                            paymentMethod: "COD"

                        })

                    });

                    const data = await response.json();

                    if (!response.ok) {

                        alert(data.message);

                        placeOrderBtn.disabled = false;

                        return;

                    }

                    // ==========================================
                    // SAVE LAST ORDER FOR SUCCESS PAGE
                    // ==========================================

                    localStorage.setItem(
                        "lastOrder",
                        JSON.stringify(data.order)
                    );

                    alert("Order Placed Successfully!");

                    window.location.href = "success.html";

                    return;

                }

                // ==========================================
                // ONLINE PAYMENT (UPI / CARD)
                // ==========================================

                const grandTotal = checkoutCart.reduce((sum, item) => {
                    return sum + item.product.price * item.quantity;
                }, 0);

                const paymentResponse = await fetch(`${BASE_URL}/payments/create-order`, {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json",

                        Authorization: `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        amount: grandTotal

                    })

                });

                const paymentData = await paymentResponse.json();

                console.log("Payment Data:", paymentData);

                if (!paymentResponse.ok) {

                    alert(paymentData.message);
                    placeOrderBtn.disabled = false;
                    return;

                }

                const options = {

                    key: "rzp_test_TIb3VzS4YgcvVb",

                    amount: paymentData.order.amount,

                    currency: paymentData.order.currency,

                    name: "Sahu Enterprises",

                    description: "Order Payment",

                    order_id: paymentData.order.id,

                    modal: {
                        ondismiss: function () {
                            console.log("Payment cancelled");
                            placeOrderBtn.disabled = false;
                        }
                    },

                    handler: async function (response) {

                        try {

                            const verifyResponse = await fetch(`${BASE_URL}/payments/verify`, {

                                method: "POST",

                                headers: {

                                    "Content-Type": "application/json",

                                    Authorization: `Bearer ${token}`

                                },

                                body: JSON.stringify({

                                    razorpay_order_id: response.razorpay_order_id,

                                    razorpay_payment_id: response.razorpay_payment_id,

                                    razorpay_signature: response.razorpay_signature,

                                    shippingAddress: {
                                        fullName,
                                        email,
                                        phone,
                                        address,
                                        city,
                                        state,
                                        pincode
                                    },

                                    paymentMethod: payment.value

                                })

                            });

                            const verifyData = await verifyResponse.json();

                            if (!verifyResponse.ok || !verifyData.success) {

                                alert(verifyData.message || "Payment verification failed.");
                                placeOrderBtn.disabled = false;
                                return;

                            }

                            localStorage.setItem(
                                "lastOrder",
                                JSON.stringify(verifyData.order)
                            );

                            alert("Payment Successful!");

                            window.location.href = "success.html";

                        }
                        catch (error) {

                            console.error("VERIFY PAYMENT ERROR:", error);

                            alert("Payment Verification Failed");

                            placeOrderBtn.disabled = false;

                        }

                    },

                    theme: {

                        color: "#ff6b00"

                    }

                };

                const razorpay = new Razorpay(options);

                razorpay.open();

            }
            catch (error) {

                console.error("PLACE ORDER ERROR:", error);

                alert("Something went wrong while placing the order.");

                placeOrderBtn.disabled = false;

            }

        });

    }

})();