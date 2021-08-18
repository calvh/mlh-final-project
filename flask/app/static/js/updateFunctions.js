"use strict";

const updatePlayerChoice = (game) => {
  $choicePlayer.attr("src", images[game.playerChoice]);
};

const updateOpponentChoice = (game) => {
  $choiceOpponent.attr("src", images[game.opponentChoice]);
};

const updateDisplay = (game) => {
  let statusStr = "";
  switch (game.status) {
    case "CHOOSE_GAME_TYPE":
      statusStr = "Choose to play vs Human or CPU";
      break;
    case "QUEUE":
      statusStr = "Looking for a match...";
      break;
    case "WAITING_PLAYER":
      statusStr = "Waiting for you...";
      break;
    case "WAITING_OPPONENT":
      statusStr = "Waiting for your Opponent...";
      break;
    case "WAITING_BOTH":
      statusStr = "Waiting for both players...";
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

  $socketStatus.text(game.socketStatus);
  $currentRoom.text(`ROOM: ${game.room}`);
  $playerName.text(`${game.playerName} (you)`);
  $opponentName.text(`${game.opponentName}`);
  $stats.text(
    `Wins: ${game.wins}, Losses: ${game.losses}, Draws: ${game.draws}`
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
