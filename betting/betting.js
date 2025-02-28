
let classDict = {
  "AJ ZIMMERMAN": 1,
  "ANI UNDRAKONDA": 2,
  "ANISH IVATURI": 3,
  "BEN BAIEL": 4,
  "CHRIS PARK": 5,
  "DEV PATEL": 6,
  "FAIQ AHMAD": 7,
  "HENRY DALEY": 8,
  "WILKENSON HILARION": 9,
  "JOEWID SHARZA": 10,
  "JOSHUA ST. LAURENT": 11,
  "KASEY SIMMONS": 12,
  "LAVANYA GOEL": 13,
  "MATT CHENG": 14,
  "MAX GIRASOL": 15,
  "NATE NOTERMANN": 16,
  "ROBIN PAN": 17,
  "STEPHEN THOMAS": 18,
  "TIA NGUYEN": 19,
  "TIMOTHY GERMANO": 20,
  "WEITING HUANG": 21,
  "CHRIS MINNICK": 22,
  "CHRIS PENICK": 23,
};

let raceWinner = Math.floor(Math.random() * 23) + 1;

document.getElementById("submitButton").addEventListener("click", function () {
  const duck = document.getElementById("duck").value.toUpperCase();
  const betAmount = document.getElementById("betAmount").value;
  const resText = document.getElementById("res-text");
  const winAmount = betAmount * 3;
  const winner = Object.keys(classDict).find(
    (key) => classDict[key] === raceWinner
  );
  if (duck in classDict && betAmount != undefined && duck != "") {
    var progressBar = document.querySelector(".progress-bar");
    progressBar.style.width = "100%";
    progressBar.setAttribute("aria-valuenow", 100);
    setTimeout(() => {
      resText.classList.remove("hidden");
      if (raceWinner == classDict[duck]) {
        resText.innerText = `Congrats, you have won ${winAmount} dollars!`;
        resText.classList.add("alert-primary");
        displayBetHistory(duck, winAmount);
      } else {
        resText.innerHTML =
          resText.innerHTML = `<p>Sorry, ${winner} won, and you have lost all your money. Please call <a href='tel:+18005224700'>1-800-GAMBLER</a> for help</p>`;
        resText.classList.add("alert-danger");
        displayBetHistory(duck, -betAmount);
      }
    }, 5000);
  }

  console.log("Duck: " + duck);
  console.log("Bet Amount: " + betAmount);

  console.log("Race Winner Number:"+raceWinner);
  console.log("Duck Bet Number:"+classDict[duck]);
  checkNameDict(duck);

});


function checkWinner(duckNumber){
    if(duckNumber === raceWinner){
        return true;
    }
    else{
        return false;
    }
}

function checkNameDict(duckName){
    duckName = duckName.toUpperCase();
    for(duck in classDict){
        if(duck === duckName){
            return;
        }
    }
    document.getElementById("nameError").style = "display: inline; color:red";

}

function displayBetHistory(duck, betAmount) {
  const betHistoryElement = document
    .getElementById("betHistory")
    .querySelector("tbody");
  betHistoryElement.innerHTML += `
    <tr>
      <td>${duck}</td>
      <td>$${betAmount}</td>
    </tr>`;
}