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

    const name = fullName.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    if (
        name === "" ||
        emailValue === "" ||
        phoneValue === "" ||
        passwordValue === "" ||
        confirmPasswordValue === ""
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

        await createUserWithEmailAndPassword(
            auth,
            emailValue,
            passwordValue
        );

        alert("Account Created Successfully!");

        window.location.href = "login.html";

    } catch (error) {

        alert(error.message);

    }

});