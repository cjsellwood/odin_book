// Get all posts
const posts = document.querySelectorAll(".post");

posts.forEach((post) => {
  // Get comment button from a post
  const commentBtn = post.querySelector(".comment-button");

  // Get add comment button from bottom of post
  const addCommentBtn = post.querySelector(".add-comment");

  // Get new comment div
  const newComment = post.querySelector(".new-comment");

  // If clicked open and focus on new comment
  commentBtn.addEventListener("click", function () {
    if (addCommentBtn) {
      if (addCommentBtn.textContent === "Add Comment") {
        addCommentBtn.textContent = "Cancel";
      } else {
        addCommentBtn.textContent = "Add Comment";
      }
    }
    newComment.classList.toggle("show");
    newComment.querySelector("textarea").focus();
  });

  // Open new comment form if clicked on add comment
  if (addCommentBtn) {
    addCommentBtn.addEventListener("click", function () {
      newComment.classList.toggle("show");
      if (addCommentBtn.textContent === "Add Comment") {
        addCommentBtn.textContent = "Cancel";
      } else {
        addCommentBtn.textContent = "Add Comment";
      }
      newComment.querySelector("textarea").focus();
    });
  }
});

// For scrolling back to same location if button press causes page reload
window.addEventListener("load", function () {
  const y = sessionStorage.getItem("y")
  if (y) {
    window.scrollTo(0, y);
  }
  sessionStorage.removeItem("y")
})

const buttons = document.querySelectorAll("button");
buttons.forEach((button) =>
  button.addEventListener("click", function () {
    const y = window.scrollY;
    sessionStorage.setItem("y", y)
  })
);
