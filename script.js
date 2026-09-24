/* =====================================================
   GAME STATE
===================================================== */

const game = {

    player1: 0,

    player2: 0,

    finished: false

};


/* =====================================================
   ELEMENTS
===================================================== */

const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");

const race1 = document.getElementById("race1");
const race2 = document.getElementById("race2");

const name1 = document.getElementById("name1");
const name2 = document.getElementById("name2");

const winnerMessage =
    document.getElementById("winnerMessage");


/* =====================================================
   UPDATE SCORE DISPLAY
===================================================== */

function updateDisplay() {

    score1.textContent = game.player1;

    score2.textContent = game.player2;

}


/* =====================================================
   GET RACE VALUE
===================================================== */

function getRaceValue(input) {

    let value = parseInt(input.value, 10);

    if (isNaN(value) || value < 1) {

        value = 1;

        input.value = value;

    }

    return value;

}


/* =====================================================
   CHECK WINNER
===================================================== */

function checkWinner() {

    if (game.finished) {
        return;
    }


    const target1 = getRaceValue(race1);
    const target2 = getRaceValue(race2);


    if (game.player1 >= target1) {

        game.player1 = target1;

        game.finished = true;

        showWinner(
            name1.value.trim() || "Player 1"
        );

        updateDisplay();

        return;

    }


    if (game.player2 >= target2) {

        game.player2 = target2;

        game.finished = true;

        showWinner(
            name2.value.trim() || "Player 2"
        );

        updateDisplay();

    }

}


/* =====================================================
   SHOW WINNER
===================================================== */

function showWinner(name) {

    winnerMessage.textContent =
        name.toUpperCase() + " WINS!";

    winnerMessage.style.display = "block";

}


/* =====================================================
   ADD SCORE
===================================================== */

function addScore(player) {

    if (game.finished) {
        return;
    }


    if (player === 1) {

        game.player1++;

    } else {

        game.player2++;

    }


    updateDisplay();

    checkWinner();

}


/* =====================================================
   SUBTRACT SCORE
===================================================== */

function subtractScore(player) {

    if (game.finished) {
        return;
    }


    if (player === 1) {

        if (game.player1 > 0) {

            game.player1--;

        }

    } else {

        if (game.player2 > 0) {

            game.player2--;

        }

    }


    updateDisplay();

}


/* =====================================================
   BUTTONS
===================================================== */

document
    .getElementById("add1")
    .addEventListener("click", () => {

        addScore(1);

    });


document
    .getElementById("subtract1")
    .addEventListener("click", () => {

        subtractScore(1);

    });


document
    .getElementById("add2")
    .addEventListener("click", () => {

        addScore(2);

    });


document
    .getElementById("subtract2")
    .addEventListener("click", () => {

        subtractScore(2);

    });


/* =====================================================
   RACE TO
===================================================== */

race1.addEventListener("change", () => {

    getRaceValue(race1);

    checkWinner();

});


race2.addEventListener("change", () => {

    getRaceValue(race2);

    checkWinner();

});


/* =====================================================
   IMAGE UPLOAD
===================================================== */

document
    .querySelectorAll(".image-input")
    .forEach(input => {

        input.addEventListener("change", function () {

            const file = this.files[0];

            if (!file) {
                return;
            }


            const player = this.dataset.player;

            const image =
                document.getElementById(
                    "playerImage" + player
                );


            const reader = new FileReader();


            reader.onload = function (event) {

                image.src = event.target.result;

            };


            reader.readAsDataURL(file);

        });

    });


/* =====================================================
   RESET
===================================================== */

document
    .getElementById("resetButton")
    .addEventListener("click", () => {

        game.player1 = 0;

        game.player2 = 0;

        game.finished = false;


        winnerMessage.style.display = "none";

        winnerMessage.textContent = "";


        updateDisplay();

    });


/* =====================================================
   INITIALIZE
===================================================== */

updateDisplay();