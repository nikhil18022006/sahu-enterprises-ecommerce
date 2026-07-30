// ==========================================
// SAHU ENTERPRISES
// SEARCH PAGE
// ==========================================



// ==========================================
// GET SEARCH QUERY
// ==========================================

const params = new URLSearchParams(window.location.search);

const query = params.get("q")?.toLowerCase() || "";

// ==========================================
// SHOW SEARCH QUERY
// ==========================================

const searchQuery = document.getElementById("search-query");

if (searchQuery) {

    searchQuery.textContent = `"${query}"`;

}
// ==========================================
// SELECT CONTAINER
// ==========================================

const searchContainer = document.getElementById("search-products");

// ==========================================
// DISPLAY RESULTS
// ==========================================

function displaySearchResults() {

    if (!searchContainer) return;

    searchContainer.innerHTML = "";

    const filteredProducts = products.filter(function (product) {

        return (
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );

    });

    // ==========================================
    // NO PRODUCTS FOUND
    // ==========================================

    if (filteredProducts.length === 0) {

        document.getElementById("no-results").style.display = "block";
        searchContainer.style.display = "none";
        return;



    }

    // ==========================================
    // DISPLAY PRODUCTS
    // ==========================================
    document.getElementById("no-results").style.display = "none";
    searchContainer.style.display = "grid";
    filteredProducts.forEach(function (product) {

        searchContainer.innerHTML += `

            <div class="product-card">

                <span class="badge">${product.badge}</span>

                <a href="product.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                </a>

                <h3>
                    <a href="product.html?id=${product.id}">
                        ${product.name}
                    </a>
                </h3>

                <p>${product.description}</p>

                <h4>₹${product.price}</h4>

                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>

            </div>

        `;

    });

}

displaySearchResults();// ==========================================
// ==========================================
