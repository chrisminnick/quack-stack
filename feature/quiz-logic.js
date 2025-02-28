const questions = [
  {
    question: "What is the scientific name for a duck?",
    options: [
      "Anas platyrhynchos",
      "Gallus gallus",
      "Canis lupus",
      "Felis catus",
    ],
    answer: "Anas platyrhynchos",
  },
  {
    question: "What is a baby duck called?",
    options: ["Duckling", "Gosling", "Chick", "Puppy"],
    answer: "Duckling",
  },
  {
    question: "Which of these is a common duck species?",
    options: ["Mallard", "Penguin", "Eagle", "Sparrow"],
    answer: "Mallard",
  },
  {
    question: "How many species of duck are there?",
    options: ["250", "150", "80", "60"],
    answer: "150",
  },
  {
    question: "What is a male duck called?",
    options: ["Mallard", "Mandible", "Drake", "Hen"],
    answer: "Drake",
  },
  {
    question: "Up to what speed can ducks fly?",
    options: ["50mph", "70mph", "90mph", "100mph"],
    answer: "100mph",
  },
  {
    question: "What differentiates the duck from most other birds?",
    options: [
      "Totally monogamous",
      "Flies long distances",
      "Swims well",
      "Size",
    ],
    answer: "Swims well",
  },
  {
    question: "Where will you not find ducks?",
    options: ["Asia", "Africa", "Australia", "Antarctica"],
    answer: "Antarctica",
  },
  {
    question: "Which duck is the only duck to nest in trees?",
    options: ["Mallard", "Wood duck", "Gadwell", "Redhead"],
    answer: "Wood duck",
  },
  {
    question: "Which is a significant part of a duck's diet?",
    options: [
      "Grasses and seeds",
      "Seeds and worms",
      "Fish and aquatic vegetation",
      "Insects and invertebrates",
    ],
    answer: "Insects and invertebrates",
  },
];

let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const playAgainButton = document.getElementById("play-again-btn");
const resultElement = document.getElementById("result");

function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  optionsElement.innerHTML = "";
  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option-btn");
    button.addEventListener("click", () => selectOption(option));
    optionsElement.appendChild(button);
  });
}

function selectOption(selectedOption) {
  const currentQuestion = questions[currentQuestionIndex];
  if (selectedOption === currentQuestion.answer) {
    score++;
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  questionElement.style.display = "none";
  optionsElement.style.display = "none";
  playAgainButton.removeAttribute("hidden");
  resultElement.innerText = `Your score: ${score} / ${questions.length}`;
}

function resetGame() {
  currentQuestionIndex = 0;
  score = 0;
  questionElement.style.display = "block";
  optionsElement.style.display = "block";
  playAgainButton.setAttribute("hidden", "hidden");
  resultElement.textContent = `Your score will appear here`;
  loadQuestion();
}

//submitButton.addEventListener("click", loadQuestion);
playAgainButton.addEventListener("click", resetGame);

// Initialize the quiz
loadQuestion();
