const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", function () {

    console.log("Hamburger Clicked");

    menu.classList.toggle("hide-menu");

});