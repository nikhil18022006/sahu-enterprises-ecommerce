import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const loginBtn = document.querySelector(".login-btn");
const profileBtn = document.querySelector(".profile-btn");
const logoutBtn = document.querySelector(".logout-btn");

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log("Logged in:", user.email);

    } else {

        console.log("Not Logged In");

    }

});

window.logout = function () {

    signOut(auth)
        .then(() => {

            alert("Logged Out");

            window.location.href = "../pages/login.html";

        });

};