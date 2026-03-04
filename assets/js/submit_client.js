document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-container form");
  const messageContainer = document.createElement("div"); // container for success message
  form.parentNode.insertBefore(messageContainer, form);

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Stops form tranditional submission

    const formData = new FormData(form);

    fetch("../backend/add_client.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        messageContainer.textContent = data.message;
        if (data.success) {
          messageContainer.style.color = "green";
          form.reset(); // Clears the form if successful
        } else {
          messageContainer.style.color = "red";
        }
      })
      .catch((error) => {
        messageContainer.textContent = "Server connection error.";
        messageContainer.style.color = "red";
        console.error("Error:", error);
      });
  });
});
