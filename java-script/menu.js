const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

menuButton.addEventListener("click", () => {
  sideMenu.classList.toggle("open");
});
