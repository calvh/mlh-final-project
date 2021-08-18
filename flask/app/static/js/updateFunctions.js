"use strict";

const updatePlayerChoice = (game) => {
  $choicePlayer.attr("src", images[game.playerChoice]);
};

const updateOpponentChoice = (game) => {
  $choiceOpponent.attr("src", images[game.opponentChoice]);
};

const updateDisplay = (game) => {
  $gameStatus.text(game.status);
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
