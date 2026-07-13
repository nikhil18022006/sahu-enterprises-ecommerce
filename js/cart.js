// ==========================================
// SAHU ENTERPRISES
// CART.JS
// ==========================================



// ==========================================
// LOAD CART FROM LOCAL STORAGE
// ==========================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateCartCount() {

    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = cart.length;
    }

}

// Show cart count when page loads
updateCartCount();

/// ==========================================
// ADD TO CART
// ==========================================

function addToCart(productId) {

    // Find clicked product
    const product = products.find(function(item) {
        return item.id === productId;
    });

    if (!product) {
        console.error("Product not found!");
        return;
    }

    // Check if already exists in cart
    const existingProduct = cart.find(function(item) {
        return item.id === productId;
    });

    if (existingProduct) {

        // Increase quantity
        existingProduct.quantity++;

    } else {

        // Add new product with quantity
        cart.push({
            ...product,
            quantity: 1
        });

    }

    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update badge
    updateCartCount();

    // Console
    console.log(product.name + " added to cart.");
}