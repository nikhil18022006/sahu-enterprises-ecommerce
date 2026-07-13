// ==========================================
// SAHU ENTERPRISES
// LOGIN PAGE
// ==========================================



// ==========================================
// SELECT ELEMENTS
// ==========================================

const loginBtn = document.getElementById("login-btn");
const email = document.getElementById("email");
const password = document.getElementById("password");

// ==========================================
// LOGIN BUTTON CLICK
// ==========================================

loginBtn.addEventListener("click", function () {

    // ==========================================
    // GET INPUT VALUES
    // ==========================================

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    // ==========================================
    // VALIDATION
    // ==========================================

    if (emailValue === "" || passwordValue === "") {

        alert("Please fill all fields.");

        return;

    }

    // ==========================================
    // LOAD USERS
    // ==========================================

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // ==========================================
    // FIND USER
    // ==========================================

    const user = users.find(function (item) {

        return item.email === emailValue;

    });

    // ==========================================
    // CHECK USER
    // ==========================================

    if (!user) {

        alert("User not found. Please register first.");

        return;

    }

    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    if (user.password !== passwordValue) {

        alert("Incorrect password.");

        return;

    }

    // ==========================================
    // SAVE LOGIN SESSION
    // ==========================================

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    // ==========================================
    // SUCCESS
    // ==========================================

    alert("Login Successful!");

    setTimeout(function () {

        window.location.href = "../index.html";

    }, 1500);

});