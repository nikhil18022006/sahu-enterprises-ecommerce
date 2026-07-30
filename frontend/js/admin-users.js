// ==========================================
// SAHU ENTERPRISES
// ADMIN USERS
// ==========================================

const BASE_URL = "https://sahu-enterprises-ecommerce.onrender.com/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

// ==========================================
// CHECK LOGIN
// ==========================================

if (!token || !user) {

    alert("Please login first.");

    window.location.href = "../login.html";

}

if (user.role !== "admin") {

    alert("Access Denied");

    window.location.href = "../login.html";

}

// ==========================================
// LOAD USERS
// ==========================================

async function loadUsers() {

    try {

        const response = await fetch(`${BASE_URL}/users/all`, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Failed to load users.");

            return;

        }

        const usersList = document.getElementById("users-list");

        usersList.innerHTML = "";

        data.users.forEach(user => {

            usersList.innerHTML += `

                <tr>

                    <td>${user.name}</td>

                    <td>${user.email}</td>

                    <td>

                        <select onchange="changeRole('${user._id}', this.value)">

                            <option value="user" ${user.role === "user" ? "selected" : ""}>
                                User
                            </option>

                            <option value="admin" ${user.role === "admin" ? "selected" : ""}>
                                Admin
                            </option>

                        </select>

                    </td>

                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>

                    <td>

                        <button
                            class="action-btn delete-btn"
                            onclick="deleteUser('${user._id}')">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error("Load Users Error:", error);

        alert("Unable to load users.");

    }

}

// ==========================================
// CHANGE USER ROLE
// ==========================================

async function changeRole(id, role) {

    try {

        const response = await fetch(`${BASE_URL}/users/${id}/role`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                role
            })

        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {

            loadUsers();

        }

    } catch (error) {

        console.error("Change Role Error:", error);

    }

}

// ==========================================
// DELETE USER
// ==========================================

async function deleteUser(id) {

    if (!confirm("Delete this user?")) return;

    try {

        const response = await fetch(`${BASE_URL}/users/${id}`, {

            method: "DELETE",

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {

            loadUsers();

        }

    } catch (error) {

        console.error("Delete User Error:", error);

    }

}

// ==========================================
// SEARCH USERS
// ==========================================

document.getElementById("search-user").addEventListener("input", function () {

    const value = this.value.toLowerCase();

    document.querySelectorAll("#users-list tr").forEach(row => {

        row.style.display = row.textContent
            .toLowerCase()
            .includes(value)
            ? ""
            : "none";

    });

});

// ==========================================
// INITIAL LOAD
// ==========================================

loadUsers();