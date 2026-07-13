// ==========================================
// SAHU ENTERPRISES
// REGISTER PAGE
// ==========================================



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
// REGISTER BUTTON CLICK
// ==========================================

registerBtn.addEventListener("click", function () {

    // ==========================================
    // GET INPUT VALUES
    // ==========================================

    const nameValue = fullName.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
        nameValue === "" ||
        emailValue === "" ||
        phoneValue === "" ||
        passwordValue === "" ||
        confirmPasswordValue === ""
    ) {

        alert("Please fill all fields.");
        return;

    }

    // ==========================================
    // TERMS & CONDITIONS
    // ==========================================

    if (!terms.checked) {

        alert("Please accept the Terms & Conditions.");
        return;

    }

    // ==========================================
    // PASSWORD MATCH
    // ==========================================

    if (passwordValue !== confirmPasswordValue) {

        alert("Passwords do not match.");
        return;

    }

    // ==========================================
    // LOAD USERS
    // ==========================================

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // ==========================================
    // CHECK EMAIL ALREADY EXISTS
    // ==========================================

    const existingUser = users.find(function (user) {

        return user.email === emailValue;

    });

    if (existingUser) {

        alert("Email already registered. Please login.");

        return;

    }

    // ==========================================
    // CREATE USER
    // ==========================================

    const user = {

        id: Date.now(),

        name: nameValue,

        email: emailValue,

        phone: phoneValue,

        password: passwordValue

    };

    // ==========================================
    // SAVE USER
    // ==========================================

    users.push(user);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    // ==========================================
    // SUCCESS
    // ==========================================

    alert("Account Created Successfully!");

    window.location.href = "login.html";

});