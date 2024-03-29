// Dark mode toggle button
const darkBtn = document.querySelector("#theme-button");
darkBtn.addEventListener("click", function () {
  // document.documentElement.classList.toggle("dark-mode");
  if (theme === "light" || !theme) {
    theme = "dark";
    document.documentElement.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    theme = "light";
    document.documentElement.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }
});

// Open or close navbar menu
function toggleMenu() {
  const mobileMenu = document.querySelector(".mobile-menu");
  mobileMenu.classList.toggle("show");
  mobileMenu.addEventListener("click", function () {
    mobileMenu.classList.toggle("show");
  });
}

const menuBtn = document.querySelector("#menu-button");
menuBtn.addEventListener("click", toggleMenu);

// Dismiss flash message
const flash = document.querySelector(".flash-message");
function dismissFlash() {
  flash.remove();
}
if (flash) {
  flash.addEventListener("click", dismissFlash);
}

// Login as demo user
const demoBtn = document.querySelector("#demo-button");
if (demoBtn) {
  // When button pressed, submit form with demo credentials
  demoBtn.addEventListener("click", function () {
    const loginForm = document.querySelector("form");
    const emailInput = loginForm.querySelector("input[name='email'");
    const passwordInput = loginForm.querySelector("input[name='password'");
    emailInput.value = `test${Math.floor(Math.random() * 48) + 1}@test.com`;
    passwordInput.value = "testuser";
    loginForm.submit();
  });
}

// Validate inputs
const forms = document.querySelectorAll("form[novalidate]");
forms.forEach((form) => {
  form.addEventListener("submit", function (e) {
    const validity = form.checkValidity();
    // Submit if valid
    if (validity) {
      form.requestSubmit();
      // Else show user errors
    } else {
      // Prevent submission
      e.preventDefault();

      // Add validation class
      form.classList.add("was-validated");

      // Get input elements for form
      const inputElements = [...form.querySelectorAll("input, textarea")];

      // Get message elements for each input
      const messageElements = [
        ...form.querySelectorAll(
          "input + .validate-msg, textarea + .validate-msg"
        ),
      ];

      // Check if passwords match if on register page
      const confirmPassword = form.querySelector(
        "input[name='confirmPassword'"
      );
      if (confirmPassword) {
        const password = form.querySelector("input[name='password']");
        const index = Array.from(inputElements).indexOf(confirmPassword);
        if (confirmPassword.value !== password.value) {
          inputElements[index].setCustomValidity("Passwords did not match");
        } else {
          inputElements[index].setCustomValidity("");
        }
      }

      // Add validation message after
      for (let i = 0; i < inputElements.length; i++) {
        messageElements[i].textContent = inputElements[i].validationMessage;
        if (inputElements[i].validationMessage === "") {
          messageElements[i].textContent = "Good";
          messageElements[i].classList.add("good");
        } else {
          messageElements[i].classList.remove("good");
        }

        // Add listener on each element to update the message when necessary
        inputElements[i].addEventListener("input", function () {
          if (inputElements[i].checkValidity()) {
            messageElements[i].textContent = "Good";
            messageElements[i].classList.add("good");
          } else {
            messageElements[i].textContent = inputElements[i].validationMessage;
            messageElements[i].classList.remove("good");
          }
        });
      }
    }
  });
});
