"use strict";

window.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  class Game {
    constructor(status) {
      // ready, processing, ended
      this.status = status;
    }
  }

  const game = new Game("processing");

  const choicePlayer = document.querySelector("#choice-player");
  const choiceOpponent = document.querySelector("#choice-opponent");
  const btnRock = document.querySelector("#btn-rock");
  const btnPaper = document.querySelector("#btn-paper");
  const btnScissors = document.querySelector("#btn-scissors");
  const btnPlayAgain = document.querySelector("#btn-play-again");
  const statusDisplay = document.querySelector("#status");

  const choices = ["r", "p", "s"];

  const choose = (choices) => {
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = (c1, c2) => {
    // returns result for Player 1 (c1)

    if (c1 === c2) {
      return "draw";
    }

    switch (c1 + c2) {
      case "rp":
        return "lose";
      case "rs":
        return "win";
      case "pr":
        return "win";
      case "ps":
        return "lose";
      case "sr":
        return "lose";
      case "sp":
        return "win";
      default:
        return "ERROR_INVALID_CHOICE";
    }
  };

  const processChoice = (playerChoice) => {

    statusDisplay.innerHTML = "Processing...";

    choicePlayer.innerHTML = playerChoice.toUpperCase();
    const compChoice = choose(choices);
    choiceOpponent.innerHTML = compChoice.toUpperCase();

    const result = determineWinner(playerChoice, compChoice);

    statusDisplay.innerHTML = `${result.toUpperCase()}!`;
  };

  const resetGame = () => {
    choicePlayer.innerHTML = "?";
    choiceOpponent.innerHTML = "?";
    statusDisplay.innerHTML = "Waiting for Player";
    game.status = "ready";
  };

  btnRock.document.addEventListener("click", (event) => {
    event.preventDefault();
    if (game.status === "ready") {
      game.status = "processing";
      processChoice("r");
      game.status = "ended";
    }
  });

  btnPaper.document.addEventListener("click", (event) => {
    event.preventDefault();
    if (game.status === "ready") {
      game.status = "processing";
      processChoice("p");
      game.status = "ended";
    }
  });

  btnScissors.document.addEventListener("click", (event) => {
    event.preventDefault();
    if (game.status === "ready") {
      game.status = "processing";
      processChoice("s");
      game.status = "ended";
    }
  });

  btnPlayAgain.document.addEventListener("click", (event) => {
    event.preventDefault();
    if (game.status === "ended") {
      resetGame();
    }
  });
});
