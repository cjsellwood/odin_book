// Open or close navbar menu
function toggleMenu() {
  const mobileMenu = document.querySelector(".mobile-menu")
  mobileMenu.classList.toggle("show")
  mobileMenu.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
  })
}

const menuBtn = document.querySelector("#menu-button")
menuBtn.addEventListener("click", toggleMenu);
