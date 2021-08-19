"use strict";

const updatePlayerChoice = (choice) => {
  $choicePlayer.attr("src", images[choice]);
};

const updateOpponentChoice = (choice) => {
  $choiceOpponent.attr("src", images[choice]);
};

const updateStatusBar = (status) => {
  switch (status) {
    case "CONNECTED":
      $statusBar
        .removeClass("bg-danger")
        .removeClass("bg-secondary")
        .addClass("bg-success");
      break;
    case "DISCONNECTED":
      $statusBar
        .removeClass("bg-success")
        .removeClass("bg-secondary")
        .addClass("bg-danger");
    case "RECONNECTING":
      $statusBar
        .removeClass("bg-success")
        .removeClass("bg-danger")
        .addClass("bg-secondary");
  }
};

const updateDisplay = (game) => {
  let statusStr = "";
  switch (game.status) {
    case "START":
      statusStr = "Click Queue to find an opponent!";
      break;
    case "QUEUE":
      statusStr = "Looking for a match...";
      break;
    case "WAITING_BOTH":
      statusStr = "Waiting for both players";
      break;
    case "WAITING_PLAYER":
      statusStr = "Waiting for you";
      break;
    case "WAITING_OPPONENT":
      statusStr = "Waiting for your Opponent";
      break;
    case "OPPONENT_LEFT":
      statusStr = "Your opponent left! Click Queue or CPU.";
      break;
    case "ENDED":
      switch (game.lastResult) {
        case "w":
          statusStr = "You won!";
          break;
        case "l":
          statusStr = "You lost!";
          break;
        case "d":
          statusStr = "It was a draw!";
          break;
      }
      break;
  }

  $gameStatus.text(statusStr);
  $gameNumber.text(`Game #${game.gameNumber}`);
  $socketStatus.text(game.socketStatus);
  $currentRoom.text(`ROOM: ${game.room}`);
  $playerName.text(`${game.playerName} (you)`);
  $opponentName.text(`${game.opponentName}`);
  $stats.text(
    `Wins: ${game.wins}, Losses: ${game.losses}, Draws: ${game.draws} (total)`
  );
};

const updateDB = (result) => {
  // send PUT request to database to update score for player
  $.ajax({
    type: "PUT",
    url: "/scores",
    contentType: "application/json",
    data: JSON.stringify({ result }),
  })
    .done((response) => console.log("DB updated"))
    .fail((response) => console.log("DB Error: could not update score"));
};

const updateChat = (listItem) => {
  if ($("#chat-messages li").length > 100) {
    $chatMessages.find(":first-child").remove();
  }
  $chatMessages.append(listItem);
};

const updateCountdown = () => {
  let t = 3;

  const countdown = () => {
    $gameNumber.text(`New game in ${t}`);
    t--;

    if (t <= 0) {
      clearInterval(timeinterval);
    }
  };
  countdown();

  const timeinterval = setInterval(countdown, 1000);
};

const continueNextGame = () => {
  updateCountdown();

  setTimeout(() => {
    game.status = "WAITING_BOTH";
    game.gameNumber += 1;
    updateDisplay(game);
    updatePlayerChoice("q");
    updateOpponentChoice("q");
  }, 3000);
};
