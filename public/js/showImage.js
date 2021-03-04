// Show preview of uploaded image
const imageInput = document.querySelector("#image");

const imageContainer = document.querySelector(".image-container");

imageInput.addEventListener("input", function () {
  const file = imageInput.files[0];
  const reader = new FileReader();
  const image = document.createElement("img");

  reader.addEventListener(
    "load",
    function () {
      image.src = reader.result;
      image.alt = "Preview Image"
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
  }
  // Remove old children and add new
  while (imageContainer.firstChild) {
    imageContainer.removeChild(imageContainer.firstChild);
  }
  imageContainer.appendChild(image);
});
