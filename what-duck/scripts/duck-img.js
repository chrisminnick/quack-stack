// Get references to the elements
const duckImage = document.getElementById("duckImage");
const duckButton = document.getElementById("generateImage");

// Define the function to fetch the duck image
async function getRandomDuck() {
    console.log("Button clicked! Fetching new duck...");

    try {
        // Fetch the random duck image from the API
        const response = await fetch("http://random-d.uk/api/random");
        
        // If the response is successful, parse the data
        if (response.ok) {
            const data = await response.json();
            duckImage.src = data.url;
        } else {
            console.error("Error fetching duck image:", response.status);
        }
    } catch (error) {
        console.error("Error fetching duck image:", error);
    }
}

// Add an event listener to the button to fetch a new duck image when clicked
duckButton.addEventListener("click", getRandomDuck);

