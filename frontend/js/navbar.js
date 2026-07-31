const hamburger = document.getElementById("hamburger");
const menu = document.querySelector(".menu");

if (hamburger && menu) {

    hamburger.addEventListener("click", () => {

        menu.classList.toggle("active");

    });

}