document
  .getElementById("notificationForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const message = document.getElementById("message").value;
    const resultDiv = document.getElementById("result");

    try {
      const response = await fetch("/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, message }),
      });

      if (response.ok) {
        resultDiv.textContent = "Notification sent successfully!";
        document.getElementById("title").value = "";
        document.getElementById("message").value = "";
      } else {
        resultDiv.textContent = "Failed to send notification.";
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      resultDiv.textContent = "Error sending notification.";
    }
  });
