// ==========================================
// SAHU ENTERPRISES
// SHOP PAGE
// ==========================================

const productContainer = document.getElementById("shop-products");
function getProductImage(product) {
    const BACKEND_URL = "https://sahu-enterprises-ecommerce.onrender.com";

    if (!product.images || product.images.length === 0) {
        return "images/no-image.png";
    }

    let image = product.images[0];

    // Catch any localhost / 127.0.0.1 URLs saved during local testing
    if (image.includes("127.0.0.1") || image.includes("localhost")) {
        const path = image.split(/:\d+/)[1]; // strip protocol+host+port, keep path after port
        image = path || "";
    }

    if (image.startsWith("https://")) {
        return image;
    }

    if (image.startsWith("http://")) {
        return image.replace("http://", "https://");
    }

    if (!image.startsWith("/")) {
        image = "/" + image;
    }

    return BACKEND_URL + image;
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