// ==========================================
// SAHU ENTERPRISES
// SHOP.JS
// ==========================================



// ==========================================
// WISHLIST
// ==========================================


// ==========================================
// SELECT PRODUCT CONTAINER
// ==========================================

const productContainer = document.getElementById("shop-products");

// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts() {

    if (!productContainer) {
        console.error("Product container not found!");
        return;
    }

    productContainer.innerHTML = "";

    products.forEach(function (product) {

        productContainer.innerHTML += `

            <div class="product-card">

                <span class="badge">${product.badge}</span>

                <a href="product.html?id=${product.id}">

    <img
        src="${product.image}"
        alt="${product.name}">

</a>

                <h3>

    <a href="product.html?id=${product.id}">

        ${product.name}

    </a>

</h3>

                <p>${product.description}</p>

                <h4>₹${product.price}</h4>

                <div class="product-actions">

                    

                    <button
                        class="cart-btn"
                        onclick="addToCart(${product.id})">

                        Add to Cart

                    </button>

                </div>

            </div>

        `;

    });

}

// ==========================================
// LOAD PRODUCTS
// ==========================================

displayProducts();