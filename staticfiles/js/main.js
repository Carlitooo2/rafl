document.addEventListener("DOMContentLoaded", () => {
  const numberDisplay = document.getElementById("number-display");
  const drawButton = document.getElementById("draw-button");
  const resetButton = document.getElementById("reset-button");
  const modal = document.getElementById("modal");
  const closeModalButton = document.getElementById("close-modal");
  const drawnNumbersContainer = document.getElementById("drawn-numbers");
  

  let rollingInterval;

  
  // Get the hamburger button and menu
  const hamburgerButton = document.getElementById("hamburger-button");
  const menu = document.getElementById("menu");

  // Add click event to the hamburger button to toggle the menu
  hamburgerButton.addEventListener("click", () => {
    menu.classList.toggle("hidden"); // Toggle visibility of the menu
  });

  // Close the modal when the "Close" button is clicked
  closeModalButton.addEventListener("click", () => {
    modal.classList.add("hidden"); // Hide the modal
    drawButton.disabled = true;
  });

  // Function to simulate rolling effect
  function startRollingAnimation() {
    drawButton.disabled = true;
    // resetButton.disabled = true
    let tempNumber = 0;
    rollingInterval = setInterval(() => {
      tempNumber = Math.floor(Math.random() * 999) + 1; // Temporary random numbers
      numberDisplay.textContent = tempNumber;
    }, 50);
  }

  // Function to stop rolling and display result
  function stopRollingAnimation(finalNumber) {
    drawButton.disabled = false;
    // resetButton.disabled = false
    clearInterval(rollingInterval);
    numberDisplay.textContent = finalNumber;

    if (finalNumber !== "reset") {
      // Add the number to the list if not reset
      const currentDrawnNumbers = drawnNumbersContainer.textContent.trim();
      const updatedNumbers = currentDrawnNumbers ? `${currentDrawnNumbers}, ${finalNumber}` : finalNumber;

      drawnNumbersContainer.textContent = updatedNumbers;  // Update the drawn numbers on the page
    }
  }

  // Handle Draw Button
  drawButton.addEventListener("click", async () => {
    // Disable the draw button if all numbers are drawn
    const response = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": getCSRFToken(),
      },
    });

    if (response.ok) {
      const data = await response.json();

      if (data.all_drawn) {
        drawButton.disabled = true; // Disable the draw button if all numbers are drawn
        modal.classList.remove("hidden"); // Show the modal
      } else {
        startRollingAnimation(); // Start the rolling animation if numbers are available
        setTimeout(() => stopRollingAnimation(data.result), 2000); // Stop after 2s
      }
    } else {
      console.error("Failed to draw a number");
      stopRollingAnimation("Error");
    }
  });

  // Handle Reset Button
  resetButton.addEventListener("click", async () => {
    const response = await fetch("reset/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": getCSRFToken(),
      },
    });

    if (response.ok) {
      const data = await response.json();
      stopRollingAnimation(data.result);
    }
  });

  // Get CSRF Token
  function getCSRFToken() {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
    return cookieValue;
  }
});
