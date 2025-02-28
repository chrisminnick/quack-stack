async function getFact() {
  try {
    const response = await fetch("duckFacts.json");
    const facts = await response.json();

    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    console.log(randomFact);
    document.getElementById("fact").innerText = randomFact.fact;
  } catch (error) {
    console.error("Error: ", error);
  }
}

document.getElementById("showFact").addEventListener("click", getFact);
