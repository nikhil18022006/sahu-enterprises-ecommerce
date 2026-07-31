// ==========================================
// SAHU ENTERPRISES
// SHOP PAGE
// ==========================================

const productContainer = document.getElementById("shop-products");
const SERVER_URL = "https://sahu-enterprises-ecommerce.onrender.com";

function getProductImage(product) {

    if (!product.images || product.images.length === 0) {
        return "https://via.placeholder.com/300x300?text=No+Image";
    }

    let image = product.images[0];

    // Cloudinary image
    if (image.startsWith("https://res.cloudinary.com")) {
        return image;
    }

    // Old localhost image
    if (image.includes("127.0.0.1") || image.includes("localhost")) {
        return "https://via.placeholder.com/300x300?text=No+Image";
    }

    // Relative upload path
    if (image.startsWith("/")) {
        return SERVER_URL + image;
    }

    return SERVER_URL + "/" + image;
}
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
        console.log("Products:", data.products);

        data.products.forEach((product) => {

            productContainer.innerHTML += `
                <div class="product-card">

                    <span class="badge">NEW</span>

                    <a href="product.html?id=${product._id}">
                        <img src="${getProductImage(product)}" alt="${product.name}">
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