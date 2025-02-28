// Select the button element
const quackButton = document.getElementById("quackButton");

// Create a new audio element
const quackSound = new Audio("quack_5.mp3");

// Add an event listener for the button click
quackButton.addEventListener("click", () => {
  // Play the quack sound when the button is clicked
  quackSound.play();
});
