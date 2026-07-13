// ==========================================
// SAHU ENTERPRISES
// PRODUCT DETAILS
// ==========================================



// ==========================================
// GET PRODUCT ID FROM URL
// ==========================================

const params = new URLSearchParams(window.location.search);

const productId = Number(params.get("id"));

// ==========================================
// FIND PRODUCT
// ==========================================

const product = products.find(function (item) {

    return item.id === productId;

});

// ==========================================
// PRODUCT NOT FOUND
// ==========================================

if (!product) {

    alert("Product not found.");

    window.location.href = "shop.html";

}

// ==========================================
// DISPLAY PRODUCT
// ==========================================

document.getElementById("product-image").src =
    product.image;

document.getElementById("product-image").alt =
    product.name;

document.getElementById("product-name").textContent =
    product.name;

document.getElementById("product-description").textContent =
    product.description;

document.getElementById("product-price").textContent =
    "₹" + product.price;

// ==========================================
// ADD TO CART
// ==========================================

document
.getElementById("add-to-cart-btn")
.addEventListener("click", function () {

    const qty = Number(quantityInput.value);

    for (let i = 0; i < qty; i++) {

        addToCart(product.id);

    }

    alert(qty + " item(s) added to cart.");

});
// ==========================================
// BUY NOW
// ==========================================

document
.getElementById("buy-now-btn")
.addEventListener("click", function () {

    const qty = Number(quantityInput.value);

    for (let i = 0; i < qty; i++) {

        addToCart(product.id);

    }

    window.location.href = "checkout.html";

});
    // ==========================================
// QUANTITY
// ==========================================

const quantityInput = document.getElementById("quantity");
const plusBtn = document.getElementById("plus");
const minusBtn = document.getElementById("minus");

plusBtn.addEventListener("click", function () {

    quantityInput.value++;

});

minusBtn.addEventListener("click", function () {

    if (quantityInput.value > 1) {

        quantityInput.value--;

    }

});