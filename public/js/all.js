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

// Dismiss flash message
const flash = document.querySelector(".flash-message")
function dismissFlash() {
  flash.remove();
}
if (flash) {
  flash.addEventListener("click", dismissFlash)

}