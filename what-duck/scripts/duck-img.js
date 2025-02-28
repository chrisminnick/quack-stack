function getRandomDuck() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;  // Generate a random number between 1 and 100
    const imageUrl = `https://random-d.uk/api/${randomNumber}.jpg`;  // Construct the image URL

    document.getElementById('duckImage').src = imageUrl;  // Update the image source
}

// Add event listener to the button when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generateImage').addEventListener('click', getRandomDuck);
});




