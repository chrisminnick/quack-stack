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
];

let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const submitButton = document.getElementById("submit-btn");
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
  submitButton.style.display = "none";
  resultElement.textContent = `Your score: ${score} / ${questions.length}`;
}

submitButton.addEventListener("click", loadQuestion);

// Initialize the quiz
loadQuestion();
