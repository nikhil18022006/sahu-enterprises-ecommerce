// ==========================================
// SAHU ENTERPRISES
// LOGIN PAGE
// ==========================================

const loginBtn = document.getElementById("login-btn");
const email = document.getElementById("email");
const password = document.getElementById("password");

loginBtn.addEventListener("click", async () => {

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!emailValue || !passwordValue) {
        alert("Please fill all fields.");
        return;
    }

    try {

        const response = await fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailValue,
                password: passwordValue
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        // Save Token
        localStorage.setItem("token", data.token);

        // Save User
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login Successful!");

        // Redirect based on role
        if (data.user.role === "admin") {

            window.location.href = "admin/dashboard.html";

        } else {

            window.location.href = "../index.html";

        }

    } catch (error) {

        console.error(error);

        alert("Login Failed");

    }

});
const user = await User.findOne({ email });

console.log("Login Email:", email);
console.log("User Found:", user ? "YES" : "NO");

if (!user) {
    return res.status(400).json({
        success: false,
        message: "Invalid Email or Password"
    });
}

console.log("Stored Hash:", user.password);

const isMatch = await bcrypt.compare(password, user.password);

console.log("Password Match:", isMatch);