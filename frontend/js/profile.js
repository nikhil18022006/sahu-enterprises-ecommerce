// ==========================================
// PROFILE PAGE
// ==========================================



const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {

    window.location.href = "login.html";

}
// ==========================================
// SAVE PROFILE
// ==========================================

const saveBtn = document.getElementById("save-profile");
if (saveBtn) {

    saveBtn.addEventListener("click", function () {

        // Get updated values

        const updatedUser = {

            ...currentUser,

            name: document.getElementById("name").value.trim(),

            phone: document.getElementById("phone").value.trim(),

            address: document.getElementById("address").value.trim(),

            city: document.getElementById("city").value.trim(),

            state: document.getElementById("state").value.trim(),

            pincode: document.getElementById("pincode").value.trim()

        };

        // Update currentUser

        localStorage.setItem(
            "currentUser",
            JSON.stringify(updatedUser)
        );

        // Load all users

        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Find logged-in user

        const index = users.findIndex(function (user) {

            return user.email === currentUser.email;

        });

        // Replace old data

        if (index !== -1) {

            users[index] = updatedUser;

        }

        // Save users array

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        alert("Profile Updated Successfully!");

    });

}