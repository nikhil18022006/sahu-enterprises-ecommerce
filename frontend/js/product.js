// ==========================================
// SAHU ENTERPRISES
// PRODUCT DETAILS
// ==========================================





const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let product;

async function loadProduct() {

    try {

        const response = await fetch(`${BASE_URL}/products/${productId}`);

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);
            window.location.href = "shop.html";
            return;

        }

        product = data.product;

        const mainImage = document.getElementById("product-image");
        const thumbnailContainer = document.getElementById("thumbnail-container");

        // ==========================
        // MAIN PRODUCT DETAILS
        // ==========================

        mainImage.src = product.images[0];
        mainImage.alt = product.name;

        document.getElementById("product-name").textContent = product.name;

        document.getElementById("product-description").textContent =
            product.description;

        document.getElementById("product-price").textContent =
            "₹" + product.price;

        // ==========================
        // CREATE THUMBNAILS
        // ==========================

        thumbnailContainer.innerHTML = "";

        product.images.forEach((image, index) => {

            const thumbnail = document.createElement("img");

            thumbnail.src = image;

            thumbnail.alt = `${product.name} ${index + 1}`;

            thumbnail.classList.add("thumbnail");

            if (index === 0) {
                thumbnail.classList.add("active-thumbnail");
            }

            thumbnail.addEventListener("click", function () {

                // Change Main Image
                mainImage.src = image;

                // Remove Active Class
                document.querySelectorAll(".thumbnail").forEach(img => {
                    img.classList.remove("active-thumbnail");
                });

                // Add Active Class
                thumbnail.classList.add("active-thumbnail");

            });

            thumbnailContainer.appendChild(thumbnail);

        });

    } catch (error) {

        console.error(error);

    }

}

loadProduct();

// ==========================================
// DISPLAY PRODUCT
// ==========================================


// ==========================================
// ADD TO CART
// ==========================================

document
    .getElementById("add-to-cart-btn")
    .addEventListener("click", function () {

        const qty = Number(quantityInput.value);

        for (let i = 0; i < qty; i++) {

            addToCart(product._id);

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