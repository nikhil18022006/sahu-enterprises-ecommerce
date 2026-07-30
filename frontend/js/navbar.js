const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

if (hamburger && menu) {

    hamburger.addEventListener("click", function () {

        menu.classList.toggle("hide-menu");

    });

}