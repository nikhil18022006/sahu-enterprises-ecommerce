// ==========================================
// SAHU ENTERPRISES
// REGISTER PAGE
// ==========================================

console.log("Register JS Loaded");

import { BASE_URL } from "./api.js";

// ==========================================
// SELECT ELEMENTS
// ==========================================

const registerBtn = document.getElementById("register-btn");

const fullName = document.getElementById("fullname");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const terms = document.getElementById("terms");

// ==========================================
// REGISTER
// ==========================================

registerBtn.addEventListener("click", async () => {

    const name = fullName.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    // Validation

    if (
        !name ||
        !emailValue ||
        !phoneValue ||
        !passwordValue ||
        !confirmPasswordValue
    ) {
        alert("Please fill all fields.");
        return;
    }

    if (!terms.checked) {
        alert("Please accept Terms & Conditions.");
        return;
    }

    if (passwordValue !== confirmPasswordValue) {
        alert("Passwords do not match.");
        return;
    }

    try {

        const response = await fetch(`${BASE_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email: emailValue,
                password: passwordValue
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Account Created Successfully!");

        window.location.href = "login.html";

    } catch (error) {

        console.error(error);
        alert("Registration Failed");

    }

});