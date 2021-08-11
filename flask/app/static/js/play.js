"use strict";

$(document).ready(() => {
  class Game {
    constructor(status) {
      // ready, processing, ended
      this.status = status;
    }
  }

  const imgMale = `<img src="./static/img/male.png" style="border-radius:50%; height: 300px; width: 300px;"></img>`;
  const imgFemale = `<img src="./static/img/female.png" style="border-radius:50%; height: 300px; width: 300px;"></img>`;
  const imgRock = `<img src="./static/img/icons8-rock-80.png"></img>`;
  const imgPaper = `<img src="./static/img/icons8-paper-80.png"></img>`;
  const imgScissors = `<img src="./static/img/icons8-hand-scissors-80.png"></img>`;

  const game = new Game("processing");

  const $choicePlayer = $("#choice-player");
  const $choiceOpponent = $("#choice-opponent");
  const $btnRock = $("#btn-rock");
  const $btnPaper = $("#btn-paper");
  const $btnScissors = $("#btn-scissors");
  const $btnPlayAgain = $("#btn-play-again");
  const $statusDisplay = $("#status");

  const choices = ["r", "p", "s"];

  const images = {
    r: imgRock,
    p: imgPaper,
    s: imgScissors,
    male: imgMale,
    female: imgFemale,
  };

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
    $statusDisplay.text("Processing...");

    const compChoice = choose(choices);

    $choicePlayer.html(images[playerChoice]);
    $choiceOpponent.html(images[compChoice]);

    const result = determineWinner(playerChoice, compChoice);

    $statusDisplay.text(`${result.toUpperCase()}!`);
  };

  const resetGame = () => {
    $choicePlayer.html(images["female"]);
    $choiceOpponent.html(images["male"]);
    $statusDisplay.text("Waiting for Player");
    game.status = "ready";
  };

  $btnRock.on("click", (event) => {
    event.preventDefault();
    if (game.status === "ready") {
      game.status = "processing";
      processChoice("r");
      game.status = "ended";
    }
  });

  $btnPaper.on("click", (event) => {
    event.preventDefault();
    if (game.status === "ready") {
      game.status = "processing";
      processChoice("p");
      game.status = "ended";
    }
  });

  $btnScissors.on("click", (event) => {
    event.preventDefault();
    if (game.status === "ready") {
      game.status = "processing";
      processChoice("s");
      game.status = "ended";
    }
  });

  $btnPlayAgain.on("click", (event) => {
    event.preventDefault();
    if (game.status === "ended") {
      resetGame();
    }
  });

  resetGame();
});
