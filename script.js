// ============================================================
// SCOREBOARD SCRIPT
// ============================================================

// ============================================================
// STATE
// ============================================================

let score1 = 0;
let score2 = 0;

let race1 = 10;
let race2 = 10;

let winner = null;


// ============================================================
// ELEMENTS
// ============================================================

// Scores
const score1Element = document.getElementById("score1");
const score2Element = document.getElementById("score2");

// Race targets
const race1Input = document.getElementById("race1");
const race2Input = document.getElementById("race2");

// Player names
const name1Input = document.getElementById("name1");
const name2Input = document.getElementById("name2");

// Score buttons
const subtract1 = document.getElementById("subtract1");
const add1 = document.getElementById("add1");

const subtract2 = document.getElementById("subtract2");
const add2 = document.getElementById("add2");

// Reset
const resetButton = document.getElementById("resetButton");

// Images
const imageInputs = document.querySelectorAll(".image-input");

const playerImage1 = document.getElementById("playerImage1");
const playerImage2 = document.getElementById("playerImage2");

// Winner popup
const winnerOverlay = document.getElementById("winnerOverlay");
const winnerTitle = document.getElementById("winnerTitle");
const winnerMessage = document.getElementById("winnerMessage");
const closeWinner = document.getElementById("closeWinner");


// ============================================================
// STORAGE
// ============================================================

const STORAGE_KEY = "scoreboardData";


// ============================================================
// SAVE STATE
// ============================================================

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

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );

    console.log("Scoreboard saved:", data);

  } catch (error) {
    console.error(
      "Failed to save scoreboard:",
      error
    );
  }
}


// ============================================================
// LOAD STATE
// ============================================================

function loadState() {
  try {
    const savedData = localStorage.getItem(
      STORAGE_KEY
    );

    // Nothing saved yet
    if (!savedData) {
      updateDisplay();
      return;
    }

    const data = JSON.parse(savedData);

    // ----------------------------
    // Scores
    // ----------------------------

    score1 = Number(data.score1) || 0;
    score2 = Number(data.score2) || 0;


    // ----------------------------
    // Race targets
    // ----------------------------

    race1 = Number(data.race1) || 8;
    race2 = Number(data.race2) || 9;

    race1Input.value = race1;
    race2Input.value = race2;


    // ----------------------------
    // Player names
    // ----------------------------

    if (
      typeof data.name1 === "string" &&
      data.name1.trim() !== ""
    ) {
      name1Input.value = data.name1;
    }

    if (
      typeof data.name2 === "string" &&
      data.name2.trim() !== ""
    ) {
      name2Input.value = data.name2;
    }


    // ----------------------------
    // Player images
    // ----------------------------

    if (
      typeof data.image1 === "string" &&
      data.image1 !== ""
    ) {
      playerImage1.src = data.image1;
    }

    if (
      typeof data.image2 === "string" &&
      data.image2 !== ""
    ) {
      playerImage2.src = data.image2;
    }


    // ----------------------------
    // Winner
    // ----------------------------

    winner = data.winner || null;


    // ----------------------------
    // Update display
    // ----------------------------

    updateDisplay();


    // ----------------------------
    // Restore winner popup
    // ----------------------------

    if (winner === 1) {
      showWinner(
        name1Input.value || "Player 1"
      );
    }

    if (winner === 2) {
      showWinner(
        name2Input.value || "Player 2"
      );
    }

  } catch (error) {
    console.error(
      "Failed to load scoreboard:",
      error
    );

    localStorage.removeItem(
      STORAGE_KEY
    );

    updateDisplay();
  }
}


// ============================================================
// UPDATE DISPLAY
// ============================================================

function updateDisplay() {
  score1Element.textContent = score1;
  score2Element.textContent = score2;

  race1Input.value = race1;
  race2Input.value = race2;

  updateButtonState();
}


// ============================================================
// UPDATE BUTTON STATE
// ============================================================

function updateButtonState() {

  const gameFinished = winner !== null;


  // Player 1

  subtract1.disabled = gameFinished;
  add1.disabled = gameFinished;


  // Player 2

  subtract2.disabled = gameFinished;
  add2.disabled = gameFinished;


  // Race targets

  race1Input.disabled = gameFinished;
  race2Input.disabled = gameFinished;


  // CSS state

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


// ============================================================
// CHECK WINNER
// ============================================================

function checkWinner() {

  // Someone already won
  if (winner !== null) {
    return;
  }


  // ----------------------------
  // Player 1
  // ----------------------------

  if (score1 >= race1) {

    winner = 1;

    showWinner(
      name1Input.value || "Player 1"
    );

    saveState();

    updateButtonState();

    return;
  }


  // ----------------------------
  // Player 2
  // ----------------------------

  if (score2 >= race2) {

    winner = 2;

    showWinner(
      name2Input.value || "Player 2"
    );

    saveState();

    updateButtonState();

    return;
  }
}


// ============================================================
// SHOW WINNER POPUP
// ============================================================

function showWinner(playerName) {

  // Winner's name
  winnerTitle.textContent = playerName;

  // Message
  winnerMessage.textContent = "WINS!";

  // Show popup
  winnerOverlay.classList.add("show");
}


// ============================================================
// HIDE WINNER POPUP
// ============================================================

function hideWinner() {

  winnerOverlay.classList.remove("show");
}


// ============================================================
// PLAYER 1 +1
// ============================================================

add1.addEventListener("click", () => {

  if (winner !== null) {
    return;
  }


  score1++;


  // Update screen immediately
  updateDisplay();


  // Check if Player 1 reached their race
  checkWinner();


  // SAVE IMMEDIATELY
  saveState();
});


// ============================================================
// PLAYER 1 -1
// ============================================================

subtract1.addEventListener("click", () => {

  if (winner !== null) {
    return;
  }


  if (score1 > 0) {
    score1--;
  }


  // Update screen
  updateDisplay();


  // SAVE IMMEDIATELY
  saveState();
});


// ============================================================
// PLAYER 2 +1
// ============================================================

add2.addEventListener("click", () => {

  if (winner !== null) {
    return;
  }


  score2++;


  // Update screen
  updateDisplay();


  // Check winner
  checkWinner();


  // SAVE IMMEDIATELY
  saveState();
});


// ============================================================
// PLAYER 2 -1
// ============================================================

subtract2.addEventListener("click", () => {

  if (winner !== null) {
    return;
  }


  if (score2 > 0) {
    score2--;
  }


  // Update screen
  updateDisplay();


  // SAVE IMMEDIATELY
  saveState();
});


// ============================================================
// PLAYER 1 RACE TARGET
// ============================================================

race1Input.addEventListener(
  "change",
  () => {

    if (winner !== null) {
      return;
    }


    let value = parseInt(
      race1Input.value,
      10
    );


    if (isNaN(value) || value < 1) {
      value = 1;
    }


    race1 = value;

    race1Input.value = race1;


    // Check if current score
    // already reaches new target
    checkWinner();


    // SAVE IMMEDIATELY
    saveState();


    updateDisplay();
  }
);


// ============================================================
// PLAYER 2 RACE TARGET
// ============================================================

race2Input.addEventListener(
  "change",
  () => {

    if (winner !== null) {
      return;
    }


    let value = parseInt(
      race2Input.value,
      10
    );


    if (isNaN(value) || value < 1) {
      value = 1;
    }


    race2 = value;

    race2Input.value = race2;


    // Check if current score
    // already reaches new target
    checkWinner();


    // SAVE IMMEDIATELY
    saveState();


    updateDisplay();
  }
);


// ============================================================
// PLAYER 1 NAME
// ============================================================

name1Input.addEventListener(
  "input",
  () => {

    // SAVE IMMEDIATELY
    saveState();


    // Update winner popup if
    // Player 1 already won

    if (winner === 1) {

      winnerTitle.textContent =
        name1Input.value ||
        "Player 1";
    }
  }
);


// ============================================================
// PLAYER 2 NAME
// ============================================================

name2Input.addEventListener(
  "input",
  () => {

    // SAVE IMMEDIATELY
    saveState();


    // Update winner popup if
    // Player 2 already won

    if (winner === 2) {

      winnerTitle.textContent =
        name2Input.value ||
        "Player 2";
    }
  }
);


// ============================================================
// PLAYER IMAGE UPLOAD
// ============================================================

imageInputs.forEach(
  (input) => {

    input.addEventListener(
      "change",
      (event) => {

        const file =
          event.target.files[0];


        if (!file) {
          return;
        }


        // Make sure it's an image
        if (
          !file.type.startsWith(
            "image/"
          )
        ) {

          alert(
            "Please select an image file."
          );

          return;
        }


        const reader =
          new FileReader();


        reader.onload =
          function (e) {

            const imageData =
              e.target.result;


            const player =
              input.dataset.player;


            if (player === "1") {

              playerImage1.src =
                imageData;
            }


            if (player === "2") {

              playerImage2.src =
                imageData;
            }


            // SAVE IMMEDIATELY
            saveState();
          };


        reader.readAsDataURL(file);
      }
    );
  }
);


// ============================================================
// RESET
// ============================================================

resetButton.addEventListener(
  "click",
  () => {

    const confirmed =
      confirm(
        "Are you sure you want to reset the scoreboard?"
      );


    if (!confirmed) {
      return;
    }


    // ----------------------------
    // Reset scores
    // ----------------------------

    score1 = 0;
    score2 = 0;


    // ----------------------------
    // Reset winner
    // ----------------------------

    winner = null;


    // ----------------------------
    // Reset race targets
    // ----------------------------

    race1 = 10;
    race2 = 10;


    // ----------------------------
    // Reset names
    // ----------------------------

    name1Input.value =
      "Player 1";

    name2Input.value =
      "Player 2";


    // ----------------------------
    // Reset race inputs
    // ----------------------------

    race1Input.value = race1;
    race2Input.value = race2;


    // ----------------------------
    // Close popup
    // ----------------------------

    hideWinner();


    // ----------------------------
    // Update screen
    // ----------------------------

    updateDisplay();


    // ----------------------------
    // SAVE RESET IMMEDIATELY
    // ----------------------------

    saveState();
  }
);


// ============================================================
// CLOSE WINNER BUTTON
// ============================================================

closeWinner.addEventListener(
  "click",
  () => {

    hideWinner();
  }
);


// ============================================================
// CLICK OUTSIDE WINNER POPUP
// ============================================================

winnerOverlay.addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      winnerOverlay
    ) {

      hideWinner();
    }
  }
);


// ============================================================
// ESC KEY
// ============================================================

document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {
      hideWinner();
    }
  }
);


// ============================================================
// INITIALIZE
// ============================================================

loadState();