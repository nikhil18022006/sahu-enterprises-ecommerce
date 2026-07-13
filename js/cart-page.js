// ==========================================
// SAHU ENTERPRISES
// CART PAGE
// ==========================================



// Load Cart
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
console.log("Cart:", cart);
console.log("Cart Length:", cart.length);
// Select Elements
const cartContainer = document.getElementById("cart-items");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");

// Display Cart
function displayCart() {

    if (!cartContainer) return;

    cartContainer.innerHTML = "";

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

    cartItems.forEach(function (product) {

        grandTotal += product.price * product.quantity;

        cartContainer.innerHTML += `
            <div class="cart-item">

                <img src="${product.image}" alt="${product.name}">

                <div class="item-details">

                    <h3>${product.name}</h3>

                    <p>${product.description}</p>

                    <h4>₹${product.price}</h4>

                </div>

                <div class="quantity">

                    <div class="quantity">

    <button onclick="decreaseQuantity(${product.id})">-</button>

    <input type="number" value="${product.quantity}" readonly>

    <button onclick="increaseQuantity(${product.id})">+</button>

</div>

                </div>

                <button class="remove-btn" onclick="removeItem(${product.id})">
                    Remove
                </button>

            </div>
        `;

    });
    console.log(cartItems);
    console.log("Grand Total:", grandTotal);
    console.log(subtotalElement);
    console.log(totalElement);
    subtotalElement.textContent = "₹" + grandTotal;
    totalElement.textContent = "₹" + grandTotal;

}

// Load Cart
displayCart();
// ==========================================
// REMOVE ITEM
// ==========================================

function removeItem(productId) {

    const updatedCart = cartItems.filter(function(item) {
        return item.id !== productId;
    });

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    cartItems.length = 0;

    updatedCart.forEach(function(item) {
        cartItems.push(item);
    });

    displayCart();

    updateCartCount();

}
// ==========================================
// INCREASE QUANTITY
// ==========================================

function increaseQuantity(productId) {

    const product = cartItems.find(function(item) {
        return item.id === productId;
    });

    if (!product) return;

    product.quantity++;

    localStorage.setItem("cart", JSON.stringify(cartItems));

    displayCart();

    updateCartCount();

}
// ==========================================
// DECREASE QUANTITY
// ==========================================

function decreaseQuantity(productId) {

    const product = cartItems.find(function(item) {
        return item.id === productId;
    });

    if (!product) return;

    product.quantity--;

    if (product.quantity <= 0) {

        removeItem(productId);

        return;

    }

    localStorage.setItem("cart", JSON.stringify(cartItems));

    displayCart();

    updateCartCount();

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