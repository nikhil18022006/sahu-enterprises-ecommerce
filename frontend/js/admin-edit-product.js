// ==========================================
// SAHU ENTERPRISES
// EDIT PRODUCT
// ==========================================

const BASE_URL = "https://sahu-enterprises-ecommerce.onrender.com/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

// ==========================================
// CHECK LOGIN
// ==========================================

if (!token || !user) {

    alert("Please login first.");

    window.location.href = "../login.html";

}

if (user.role !== "admin") {

    alert("Access Denied");

    window.location.href = "../login.html";

}

// ==========================================
// GET PRODUCT ID
// ==========================================

const params = new URLSearchParams(window.location.search);

const productId = params.get("id");

if (!productId) {

    alert("Invalid Product ID");

    window.location.href = "products.html";

}

// ==========================================
// LOAD PRODUCT
// ==========================================

async function loadProduct() {

    try {

        const response = await fetch(`${BASE_URL}/products/${productId}`);

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Unable to load product.");

            return;

        }

        const product = data.product;

        document.getElementById("name").value = product.name || "";

        document.getElementById("description").value = product.description || "";

        document.getElementById("category").value = product.category || "";

        document.getElementById("price").value = product.price || 0;

        document.getElementById("stock").value = product.stock || 0;

        document.getElementById("image").value = product.images?.[0] || "";

        document.getElementById("featured").checked = product.isFeatured || false;

    } catch (error) {

        console.error("Load Product Error:", error);

        alert("Unable to load product.");

    }

}

// ==========================================
// UPDATE PRODUCT
// ==========================================

document
    .getElementById("edit-product-form")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const product = {

            name: document.getElementById("name").value.trim(),

            description: document.getElementById("description").value.trim(),

            category: document.getElementById("category").value,

            price: Number(document.getElementById("price").value),

            stock: Number(document.getElementById("stock").value),

            images: [

                document.getElementById("image").value.trim()

            ],

            isFeatured: document.getElementById("featured").checked,

            isActive: true

        };

        try {

            const response = await fetch(`${BASE_URL}/products/${productId}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify(product)

            });

            const data = await response.json();

            if (!response.ok) {

                alert(data.message || "Unable to update product.");

                return;

            }

            alert("Product Updated Successfully!");

            window.location.href = "products.html";

        } catch (error) {

            console.error("Update Product Error:", error);

            alert("Unable to update product.");

        }

    });

// ==========================================
// PAGE LOAD
// ==========================================

loadProduct();