// Dark mode toggle button
const theme = localStorage.getItem("theme");
if (theme === "dark") {
  document.documentElement.setAttribute("data-theme", "light")
  document.documentElement.classList.add("dark-mode");
} else {
  document.documentElement.setAttribute("date-theme", "dark");
  document.documentElement.classList.remove("dark-mode");
}