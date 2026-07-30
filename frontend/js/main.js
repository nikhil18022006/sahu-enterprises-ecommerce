// ==========================================
// SAHU ENTERPRISES
// MAIN.JS
// Common JavaScript for all pages
// ==========================================



// ==========================================
// LOAD CART FROM LOCAL STORAGE
// ==========================================

//const BASE_URL = "http://localhost:5000/api";

async function updateCartCount() {

    const cartCount = document.getElementById("cart-count");

    if (!cartCount) return;

    const token = localStorage.getItem("token");

    if (!token) {
        cartCount.textContent = 0;
        return;
    }

    try {

        const response = await fetch(`${BASE_URL}/cart`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (response.ok) {

            const totalItems = data.cart.items.reduce((total, item) => {
                return total + item.quantity;
            }, 0);

            cartCount.textContent = totalItems;

        } else {

            cartCount.textContent = 0;

        }

    } catch (error) {

        console.error(error);
        cartCount.textContent = 0;

    }

}

// ==========================================
// PAGE LOADED
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    updateCartCount();

});
// ==========================================
// CURRENT USER
// ==========================================



// ==========================================
// USER DROPDOWN
// ==========================================

const currentUser = JSON.parse(localStorage.getItem("user"));

const userBtn = document.getElementById("user-btn");
const userName = document.getElementById("user-name");
const dropdownMenu = document.getElementById("dropdown-menu");
const logoutBtn = document.getElementById("logout-btn");

if (currentUser) {

    if (userName) {

        userName.textContent = "Hi, " + currentUser.name;

    }
} else {

    if (userName) {

        userName.textContent = "Guest";

    }

    if (dropdownMenu) {

        const profileLink =
            dropdownMenu.querySelector('a[href="pages/profile.html"]');

        const ordersLink =
            dropdownMenu.querySelector('a[href="pages/orders.html"]');

        const wishlistLink =
            dropdownMenu.querySelector('a[href="pages/wishlist.html"]');

        if (profileLink) profileLink.style.display = "none";
        if (ordersLink) ordersLink.style.display = "none";
        if (wishlistLink) wishlistLink.style.display = "none";

    }

    if (logoutBtn) logoutBtn.style.display = "none";

}

// ==========================================
// TOGGLE DROPDOWN
// ==========================================

if (userBtn) {

    userBtn.addEventListener("click", function (e) {

        e.stopPropagation();

        dropdownMenu.classList.toggle("show");

    });

}

// ==========================================
// CLOSE WHEN CLICK OUTSIDE
// ==========================================

document.addEventListener("click", function () {

    if (dropdownMenu) {

        dropdownMenu.classList.remove("show");

    }

});

// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        window.location.href = "index.html";

    });

}


// ==========================================
// PROTECT PAGES
// ==========================================

const protectedPages = [
    "checkout.html",
    "orders.html",
    "profile.html"
];

const currentPage =
    window.location.pathname.split("/").pop();

if (
    protectedPages.includes(currentPage) &&
    !currentUser
) {
    alert("Please login first.");

    window.location.href = "login.html";
}
// ==========================================
// SEARCH
// ==========================================

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

if (searchBtn) {

    searchBtn.addEventListener("click", function () {

        const query = searchInput.value.trim();

        if (query === "") return;

        const currentPath = window.location.pathname;

        if (currentPath.includes("/pages/")) {

            window.location.href =
                "search.html?q=" + encodeURIComponent(query);

        } else {

            window.location.href =
                "pages/search.html?q=" + encodeURIComponent(query);

        }

    });

}