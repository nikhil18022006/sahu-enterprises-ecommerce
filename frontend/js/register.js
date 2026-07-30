// ==========================================
// SAHU ENTERPRISES
// REGISTER PAGE
// ==========================================
console.log("Register JS Loaded");
import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

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

    // ...your validation...

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