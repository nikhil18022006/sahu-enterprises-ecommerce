const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {

    alert("Access Denied");

    window.location.href = "../login.html";

}

const BASE_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

if (!token) {

    alert("Please login first");

    window.location.href = "../login.html";

}

async function loadUsers() {

    try {

        const response = await fetch(`${BASE_URL}/users/all`, {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        const usersList = document.getElementById("users-list");

        usersList.innerHTML = "";

        data.users.forEach(user => {

            usersList.innerHTML += `

                <tr>

                    <td>${user.name}</td>

                    <td>${user.email}</td>

                    <td>

                        <select
                            onchange="changeRole('${user._id}', this.value)"
                        >

                            <option value="user"
                                ${user.role === "user" ? "selected" : ""}>
                                User
                            </option>

                            <option value="admin"
                                ${user.role === "admin" ? "selected" : ""}>
                                Admin
                            </option>

                        </select>

                    </td>

                    <td>

                        ${new Date(user.createdAt).toLocaleDateString()}

                    </td>

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

        console.error(error);

    }

}

async function changeRole(id, role) {

    try {

        const response = await fetch(

            `${BASE_URL}/users/${id}/role`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({

                    role

                })

            }

        );

        const data = await response.json();

        alert(data.message);

    } catch (error) {

        console.error(error);

    }

}

async function deleteUser(id) {

    if (!confirm("Delete this user?")) {

        return;

    }

    try {

        const response = await fetch(

            `${BASE_URL}/users/${id}`,

            {

                method: "DELETE",

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        alert(data.message);

        if (response.ok) {

            loadUsers();

        }

    } catch (error) {

        console.error(error);

    }

}

document.getElementById("search-user")
.addEventListener("input", function () {

    const value = this.value.toLowerCase();

    const rows = document.querySelectorAll("#users-list tr");

    rows.forEach(row => {

        row.style.display = row.textContent
            .toLowerCase()
            .includes(value)
            ? ""
            : "none";

    });

});

loadUsers();