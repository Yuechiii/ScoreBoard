// ============================================================
// SCOREBOARD
// ============================================================

// ================= STATE =================

let score1 = 0;
let score2 = 0;

let race1 = 8;
let race2 = 9;

let winner = null;


// ================= ELEMENTS =================

// Scores
const score1Element = document.getElementById("score1");
const score2Element = document.getElementById("score2");

// Race targets
const race1Input = document.getElementById("race1");
const race2Input = document.getElementById("race2");

// Player names
const name1Input = document.getElementById("name1");
const name2Input = document.getElementById("name2");

// Buttons
const subtract1 = document.getElementById("subtract1");
const add1 = document.getElementById("add1");

const subtract2 = document.getElementById("subtract2");
const add2 = document.getElementById("add2");

const resetButton = document.getElementById("resetButton");

// Images
const imageInputs = document.querySelectorAll(".image-input");

const playerImage1 = document.getElementById("playerImage1");
const playerImage2 = document.getElementById("playerImage2");

// Winner popup
const winnerOverlay = document.getElementById("winnerOverlay");
const winnerMessage = document.getElementById("winnerMessage");
const closeWinner = document.getElementById("closeWinner");
const winnerTitle = document.getElementById("winnerTitle");


// ================= LOCAL STORAGE =================

const STORAGE_KEY = "scoreboardData";


// ================= SAVE STATE =================

function saveState() {
  const data = {
    score1: score1,
    score2: score2,

    race1: race1,
    race2: race2,

    name1: name1Input.value,
    name2: name2Input.value,

    image1: playerImage1.src,
    image2: playerImage2.src,

    winner: winner
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}


// ================= LOAD STATE =================

function loadState() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    updateDisplay();
    return;
  }

  try {
    const data = JSON.parse(savedData);

    // Scores
    score1 = Number(data.score1) || 0;
    score2 = Number(data.score2) || 0;

    // Race targets
    race1 = Number(data.race1) || 8;
    race2 = Number(data.race2) || 9;

    race1Input.value = race1;
    race2Input.value = race2;

    // Names
    if (data.name1) {
      name1Input.value = data.name1;
    }

    if (data.name2) {
      name2Input.value = data.name2;
    }

    // Images
    if (data.image1) {
      playerImage1.src = data.image1;
    }

    if (data.image2) {
      playerImage2.src = data.image2;
    }

    // Winner
    winner = data.winner || null;

    updateDisplay();

  } catch (error) {
    console.error("Failed to load scoreboard data:", error);

    localStorage.removeItem(STORAGE_KEY);

    updateDisplay();
  }
}


// ================= UPDATE DISPLAY =================

function updateDisplay() {
  score1Element.textContent = score1;
  score2Element.textContent = score2;

  race1Input.value = race1;
  race2Input.value = race2;

  updateButtonState();
}


// ================= BUTTON STATE =================

function updateButtonState() {
  const gameFinished = winner !== null;

  subtract1.disabled = gameFinished;
  add1.disabled = gameFinished;

  subtract2.disabled = gameFinished;
  add2.disabled = gameFinished;

  race1Input.disabled = gameFinished;
  race2Input.disabled = gameFinished;

  if (gameFinished) {
    subtract1.classList.add("disabled");
    add1.classList.add("disabled");

    subtract2.classList.add("disabled");
    add2.classList.add("disabled");
  } else {
    subtract1.classList.remove("disabled");
    add1.classList.remove("disabled");

    subtract2.classList.remove("disabled");
    add2.classList.remove("disabled");
  }
}


// ================= CHECK WINNER =================

function checkWinner() {

  // Don't check again if there is already a winner
  if (winner !== null) {
    return;
  }

  // Player 1 wins
  if (score1 >= race1) {
    winner = 1;

    showWinner(name1Input.value || "Player 1");

    saveState();

    updateButtonState();

    return;
  }

  // Player 2 wins
  if (score2 >= race2) {
    winner = 2;

    showWinner(name2Input.value || "Player 2");

    saveState();

    updateButtonState();

    return;
  }
}


// ================= SHOW WINNER =================

function showWinner(playerName) {
  winnerTitle.textContent = playerName;
  winnerMessage.textContent = "Winner!";

  winnerOverlay.classList.add("show");
}


// ================= CLOSE WINNER =================

function hideWinner() {

  winnerOverlay.classList.remove("show");
}


// ================= PLAYER 1 +1 =================

add1.addEventListener("click", () => {

  if (winner !== null) {
    return;
  }

  score1++;

  updateDisplay();

  checkWinner();

  saveState();
});


// ================= PLAYER 1 -1 =================

subtract1.addEventListener("click", () => {

  if (winner !== null) {
    return;
  }

  if (score1 > 0) {
    score1--;
  }

  updateDisplay();

  saveState();
});


// ================= PLAYER 2 +1 =================

add2.addEventListener("click", () => {

  if (winner !== null) {
    return;
  }

  score2++;

  updateDisplay();

  checkWinner();

  saveState();
});


// ================= PLAYER 2 -1 =================

subtract2.addEventListener("click", () => {

  if (winner !== null) {
    return;
  }

  if (score2 > 0) {
    score2--;
  }

  updateDisplay();

  saveState();
});


// ================= RACE TARGET 1 =================

race1Input.addEventListener("change", () => {

  if (winner !== null) {
    return;
  }

  let value = parseInt(race1Input.value);

  if (isNaN(value) || value < 1) {
    value = 1;
  }

  race1 = value;

  race1Input.value = race1;

  checkWinner();

  saveState();

  updateDisplay();
});


// ================= RACE TARGET 2 =================

race2Input.addEventListener("change", () => {

  if (winner !== null) {
    return;
  }

  let value = parseInt(race2Input.value);

  if (isNaN(value) || value < 1) {
    value = 1;
  }

  race2 = value;

  race2Input.value = race2;

  checkWinner();

  saveState();

  updateDisplay();
});


// ================= PLAYER NAME 1 =================

name1Input.addEventListener("input", () => {

  saveState();

  // If player already won, update the popup name too
  if (winner === 1) {
    winnerMessage.textContent = `${name1Input.value || "Player 1"} wins!`;
  }
});


// ================= PLAYER NAME 2 =================

name2Input.addEventListener("input", () => {

  saveState();

  // If player already won, update the popup name too
  if (winner === 2) {
    winnerMessage.textContent = `${name2Input.value || "Player 2"} wins!`;
  }
});


// ================= IMAGE UPLOAD =================

imageInputs.forEach((input) => {

  input.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

      const imageData = e.target.result;

      const player = input.dataset.player;

      if (player === "1") {
        playerImage1.src = imageData;
      }

      if (player === "2") {
        playerImage2.src = imageData;
      }

      saveState();
    };

    reader.readAsDataURL(file);
  });
});


// ================= RESET =================

resetButton.addEventListener("click", () => {

  const confirmed = confirm(
    "Are you sure you want to reset the scoreboard?"
  );

  if (!confirmed) {
    return;
  }

  score1 = 0;
  score2 = 0;

  winner = null;

  // Restore default race targets
  race1 = 8;
  race2 = 9;

  race1Input.value = race1;
  race2Input.value = race2;

  // Restore default names
  name1Input.value = "Player 1";
  name2Input.value = "Player 2";

  // Close winner popup
  hideWinner();

  // Enable controls
  updateDisplay();

  // Save reset state
  saveState();
});


// ================= CLOSE POPUP =================

closeWinner.addEventListener("click", () => {

  hideWinner();

});


// ================= CLICK OUTSIDE POPUP =================

winnerOverlay.addEventListener("click", (event) => {

  if (event.target === winnerOverlay) {
    hideWinner();
  }

});


// ================= ESC KEY =================

document.addEventListener("keydown", (event) => {

  if (event.key === "Escape") {
    hideWinner();
  }

});


// ================= INITIALIZE =================

loadState();