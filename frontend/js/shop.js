// ==========================================
// SAHU ENTERPRISES
// SHOP PAGE
// ==========================================

const productContainer = document.getElementById("shop-products");

async function displayProducts() {

    try {

        const response = await fetch(`${BASE_URL}/products`);

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            alert(data.message);
            return;
        }

        productContainer.innerHTML = "";

        data.products.forEach((product) => {

            productContainer.innerHTML += `
                <div class="product-card">

                    <span class="badge">NEW</span>

                    <a href="product.html?id=${product._id}">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </a>

                    <h3>
                        <a href="product.html?id=${product._id}">
                            ${product.name}
                        </a>
                    </h3>

                    <p>${product.description}</p>

                    <h4>₹${product.price}</h4>

                    <div class="product-actions">

                        <button
                            class="cart-btn"
                            onclick="addToCart('${product._id}')">

                            Add to Cart

                        </button>

                    </div>

                </div>
            `;

        });

    } catch (error) {

        console.error("PRODUCT ERROR:", error);

    }

}

displayProducts();