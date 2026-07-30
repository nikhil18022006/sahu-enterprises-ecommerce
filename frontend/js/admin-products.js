// ==========================================
// SAHU ENTERPRISES
// ADMIN PRODUCTS
// ==========================================
const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {

    alert("Access Denied");

    window.location.href = "../login.html";

}
const BASE_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

// ==========================================
// CHECK ADMIN LOGIN
// ==========================================

if (!token) {

    alert("Please login first.");

    window.location.href = "../login.html";

}

// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

    try {

        const response = await fetch(`${BASE_URL}/products`);

        const data = await response.json();

        const productList = document.getElementById("product-list");

        productList.innerHTML = "";

        data.products.forEach(product => {

            productList.innerHTML += `

                <tr>

                    <td>

                        <img
                            src="${product.images[0]}"
                            class="product-image"
                            alt="${product.name}"
                        >

                    </td>

                    <td>${product.name}</td>

                    <td>${product.category}</td>

                    <td>₹${product.price}</td>

                    <td>${product.stock}</td>

                    <td>

                        <button
                            class="action-btn edit-btn"
                            onclick="editProduct('${product._id}')"
                        >
                            Edit
                        </button>

                        <button
                            class="action-btn delete-btn"
                            onclick="deleteProduct('${product._id}')"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(error);

        alert("Unable to load products.");

    }

}

// ==========================================
// EDIT PRODUCT
// ==========================================

function editProduct(id) {

    window.location.href = `edit-product.html?id=${id}`;

}

// ==========================================
// DELETE PRODUCT
// ==========================================

async function deleteProduct(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {

        return;

    }

    try {

        const response = await fetch(`${BASE_URL}/products/${id}`, {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {

            loadProducts();

        }

    } catch (error) {

        console.error(error);

        alert("Unable to delete product.");

    }

}

// ==========================================
// SEARCH PRODUCTS
// ==========================================

document.getElementById("search-input")
.addEventListener("input", function () {

    const search = this.value.toLowerCase();

    const rows = document.querySelectorAll("#product-list tr");

    rows.forEach(row => {

        const name = row.children[1].textContent.toLowerCase();

        const category = row.children[2].textContent.toLowerCase();

        if (
            name.includes(search) ||
            category.includes(search)
        ) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

});

// ==========================================
// PAGE LOAD
// ==========================================

loadProducts();