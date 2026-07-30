document.addEventListener("DOMContentLoaded", async () => {

    // ===============================
    // Load Customer Navbar
    // ===============================

    const navbar = document.getElementById("navbar");

    if (navbar) {

        try {

            const navbarPath = isHomePage()
                ? "components/navbar.html"
                : "../components/navbar.html";

            const response = await fetch(navbarPath);

            navbar.innerHTML = await response.text();

            setupNavbarLinks();
            setCustomerActiveMenu();
            updateNavbarUser();
            setupCustomerLogout();
            setupUserDropdown();

            // Update cart badge after navbar is loaded
            if (typeof updateCartCount === "function") {
                updateCartCount();
            }

        } catch (error) {

            console.error("Navbar Load Error:", error);

        }

    }

    // ===============================
    // Load Admin Sidebar
    // ===============================

    const sidebar = document.getElementById("admin-sidebar");

    if (sidebar) {

        try {

            const response = await fetch("../../components/admin-sidebar.html");

            sidebar.innerHTML = await response.text();

            setAdminActiveMenu();
            setupAdminLogout();

        } catch (error) {

            console.error("Sidebar Load Error:", error);

        }

    }

});


// =======================================
// HELPER
// =======================================

function isHomePage() {

    return (
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/" ||
        window.location.pathname.endsWith("/")
    );

}


// =======================================
// CUSTOMER ACTIVE MENU
// =======================================

function setCustomerActiveMenu() {

    const page = window.location.pathname.split("/").pop();

    const pages = {

        "index.html": "home-link",

        "shop.html": "shop-link",
        "product.html": "shop-link",
        "search.html": "shop-link",

        "cart.html": "cart-link",
        "checkout.html": "cart-link",

        "contact.html": "contact-link",

        "profile.html": "profile-link",

        "orders.html": "orders-link",

        "wishlist.html": "wishlist-link"

    };

    const active = document.getElementById(pages[page]);

    if (active) {

        active.classList.add("active");

    }

}


// =======================================
// UPDATE USER NAME
// =======================================

function updateNavbarUser() {

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const userName = document.getElementById("user-name");
    const dropdown = document.getElementById("dropdown-menu");

    if (!user) {

        if (dropdown) {

            const base = isHomePage() ? "pages/" : "";

            dropdown.innerHTML = `
                <a href="${base}login.html">Login</a>
                <a href="${base}register.html">Register</a>
            `;

        }

        return;

    }

    if (userName) {

        userName.textContent = user.name;

    }

}
// =======================================
// USER DROPDOWN
// =======================================

function setupUserDropdown() {

    const userBtn = document.getElementById("user-btn");
    const dropdown = document.getElementById("dropdown-menu");

    if (!userBtn || !dropdown) return;

    userBtn.addEventListener("click", function (e) {

        e.stopPropagation();

        dropdown.classList.toggle("show");

    });

    document.addEventListener("click", function () {

        dropdown.classList.remove("show");

    });

}


// =======================================
// CUSTOMER LOGOUT
// =======================================

function setupCustomerLogout() {

    const logoutBtn = document.getElementById("logout-btn");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = isHomePage()
            ? "pages/login.html"
            : "login.html";

    });

}


// =======================================
// ADMIN ACTIVE MENU
// =======================================

function setAdminActiveMenu() {

    const page = window.location.pathname.split("/").pop();

    const map = {

        "dashboard.html": "nav-dashboard",
        "products.html": "nav-products",
        "add-product.html": "nav-products",
        "edit-product.html": "nav-products",
        "orders.html": "nav-orders",
        "users.html": "nav-users"

    };

    const active = document.getElementById(map[page]);

    if (active) {

        active.classList.add("active");

    }

}


// =======================================
// ADMIN LOGOUT
// =======================================

function setupAdminLogout() {

    const logoutBtn = document.getElementById("logout-btn");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", function (e) {

        e.preventDefault();

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "../login.html";

    });

}


// =======================================
// NAVBAR LINKS
// =======================================

function setupNavbarLinks() {

    const base = isHomePage() ? "" : "../";

    const links = {

        "home-link": `${base}index.html`,
        "shop-link": `${base}pages/shop.html`,
        "category-link": `${base}index.html#categories`,
        "contact-link": `${base}pages/contact.html`,
        "cart-link": `${base}pages/cart.html`,
        "profile-link": `${base}pages/profile.html`,
        "orders-link": `${base}pages/orders.html`,
        "wishlist-link": `${base}pages/wishlist.html`

    };

    Object.entries(links).forEach(([id, href]) => {

        const element = document.getElementById(id);

        if (element) {

            element.href = href;

        }

    });

}