// ==========================================
// SAHU ENTERPRISES
// EDIT PRODUCT
// ==========================================
const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {

    alert("Access Denied");

    window.location.href = "../login.html";

}
const BASE_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

// ==========================================
// CHECK LOGIN
// ==========================================

if (!token) {

    alert("Please login first.");

    window.location.href = "../login.html";

}

// ==========================================
// GET PRODUCT ID FROM URL
// ==========================================

const params = new URLSearchParams(window.location.search);

const productId = params.get("id");

// ==========================================
// LOAD PRODUCT
// ==========================================

async function loadProduct() {

    try {

        const response = await fetch(`${BASE_URL}/products/${productId}`);

        const data = await response.json();

        const product = data.product;

        document.getElementById("name").value = product.name;

        document.getElementById("description").value = product.description;

        document.getElementById("category").value = product.category;

        document.getElementById("price").value = product.price;

        document.getElementById("stock").value = product.stock;

        document.getElementById("image").value = product.images[0];

        document.getElementById("featured").checked = product.isFeatured;

    } catch (error) {

        console.error(error);

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

        name: document.getElementById("name").value,

        description: document.getElementById("description").value,

        category: document.getElementById("category").value,

        price: Number(document.getElementById("price").value),

        stock: Number(document.getElementById("stock").value),

        images: [

            document.getElementById("image").value

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

            alert(data.message);

            return;

        }

        alert("Product Updated Successfully!");

        window.location.href = "products.html";

    } catch (error) {

        console.error(error);

        alert("Unable to update product.");

    }

});

// ==========================================
// PAGE LOAD
// ==========================================

loadProduct();