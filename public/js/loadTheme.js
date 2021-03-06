// Dark mode toggle button
let theme = localStorage.getItem("theme");
if (theme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark")
  document.documentElement.classList.add("dark-mode");
} else {
  document.documentElement.setAttribute("date-theme", "light");
  document.documentElement.classList.remove("dark-mode");
}