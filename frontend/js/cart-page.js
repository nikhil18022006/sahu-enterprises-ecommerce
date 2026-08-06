// ==========================================
// SAHU ENTERPRISES
// CART PAGE
// ==========================================


let cartItems = [];
// Select Elements
const cartContainer = document.getElementById("cart-items");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");
async function loadCart() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(`${BASE_URL}/cart`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);
            return;

        }

        cartItems = data.cart.items;

        displayCart();

    } catch (error) {

        console.error(error);

    }

}
// Display Cart
function displayCart() {

    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    // Remove invalid products
    cartItems = cartItems.filter(item => item.product);

    if (cartItems.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your Cart is Empty</h2>
                <p>Add some products from the shop.</p>
            </div>
        `;

        subtotalElement.textContent = "₹0";
        totalElement.textContent = "₹0";
        return;
    }

    let grandTotal = 0;

    cartItems.forEach(item => {

        const product = item.product;

        grandTotal += product.price * item.quantity;

        cartContainer.innerHTML += `
            <div class="cart-item">

                <img src="${product.images[0]}" alt="${product.name}">

                <div class="item-details">

                    <h3>${product.name}</h3>

                    <p>${product.description}</p>

                    <h4>₹${product.price}</h4>

                </div>

                <div class="quantity">

                    <button onclick="decreaseQuantity('${product._id}')">-</button>

                    <input type="number" value="${item.quantity}" readonly>

                    <button onclick="increaseQuantity('${product._id}')">+</button>

                </div>

                <button class="remove-btn"
                    onclick="removeItem('${product._id}')">

                    Remove

                </button>

            </div>
        `;

    });

    subtotalElement.textContent = "₹" + grandTotal;
    totalElement.textContent = "₹" + grandTotal;


    console.log(cartItems);
    console.log("Grand Total:", grandTotal);
    console.log(subtotalElement);
    console.log(totalElement);
    subtotalElement.textContent = "₹" + grandTotal;
    totalElement.textContent = "₹" + grandTotal;

}

// Load Cart
loadCart();
// ==========================================
// REMOVE ITEM
// ==========================================

async function removeItem(productId) {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(`${BASE_URL}/cart/${productId}`, {

            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);
            return;

        }

        loadCart();

    } catch (error) {

        console.error(error);

    }

}
// ==========================================
// INCREASE QUANTITY
// ==========================================

async function increaseQuantity(productId) {

    try {

        const token = localStorage.getItem("token");

        const item = cartItems.find(cartItem => cartItem.product._id === productId);

        if (!item) return;

        const response = await fetch(`${BASE_URL}/cart/${productId}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                quantity: item.quantity + 1
            })

        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        loadCart();

    } catch (error) {

        console.error(error);

    }

}
// ==========================================
// DECREASE QUANTITY
// ==========================================

async function decreaseQuantity(productId) {

    try {

        const token = localStorage.getItem("token");

        const item = cartItems.find(cartItem => cartItem.product._id === productId);

        if (!item) return;

        if (item.quantity === 1) {

            removeItem(productId);
            return;

        }

        const response = await fetch(`${BASE_URL}/cart/${productId}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                quantity: item.quantity - 1
            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);
            return;

        }

        loadCart();

    } catch (error) {

        console.error(error);

    }

}
// ==========================================
// PROCEED TO CHECKOUT
// ==========================================

const checkoutButton = document.getElementById("checkout-btn");

if (checkoutButton) {

    checkoutButton.addEventListener("click", function () {

        window.location.href = "checkout.html";

    });

}