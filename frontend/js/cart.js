// ==========================================
// SAHU ENTERPRISES
// CART.JS
// ==========================================

// ==========================================
// UPDATE CART COUNT
// ==========================================

async function updateCartCount() {

    const cartCount = document.getElementById("cart-count");

    if (!cartCount) return;

    const token = localStorage.getItem("token");

    if (!token) {
        cartCount.textContent = "0";
        return;
    }

    try {

        const response = await fetch(${BASE_URL}/cart, {

            headers: {
                Authorization: Bearer ${token}
            }

        });

        const data = await response.json();

        if (!response.ok) {
            cartCount.textContent = "0";
            return;
        }

        const totalItems = data.cart.items.reduce((total, item) => {
            return total + item.quantity;
        }, 0);

        cartCount.textContent = totalItems;

    } catch (error) {

        console.error(error);
        cartCount.textContent = "0";

    }

}

// ==========================================
// ADD TO CART
// ==========================================

async function addToCart(productId) {

    try {

        const token = localStorage.getItem("token");

        if (!token) {

            alert("Please login first.");
            window.location.href = "login.html";
            return;

        }

        const response = await fetch(${BASE_URL}/cart, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",
                Authorization: Bearer ${token}

            },

            body: JSON.stringify({

                productId,
                quantity: 1

            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);
            return;

        }

        await updateCartCount();

        alert("Product added to cart.");

        console.log(data);

    } catch (error) {

        console.error(error);

    }

}

// ==========================================
// SHOW CART COUNT ON PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", updateCartCount);