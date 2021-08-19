"use strict";
const endGame = (game) => {
  updateOpponentChoice(game.opponentChoice);
  game.processChoices();
  updateDB(game.result);
  updateStatus(game.status, game.lastResult);
  continueNextGame(game);
};

const continueNextGame = (game) => {
  updateCountdown();

  setTimeout(() => {
    // handle opponent leaving during timeout
    if (game.room) {
      game.status = "WAITING_BOTH";
      game.gameNumber += 1;

      updateDisplay(game);
      updatePlayerChoice("q");
      updateOpponentChoice("q");
    }
  }, 3000);
};

const updateDisplay = (game) => {
  updateStatus(game.status, game.lastResult);
  updateStatusBar(game.socketStatus);
  updateGameNumber(game.gameNumber);
  updateSocketStatus(game.socketStatus);
  updateCurrentRoom(game.currentRoom);
  updatePlayerName(game.playerName);
  updateOpponentName(game.opponentChoice);
  updateStats(game.wins, game.losses, game.draws);
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
      break;
    case "STOPPED":
      $statusBar
        .removeClass("bg-success")
        .removeClass("bg-danger")
        .addClass("bg-secondary");
      break;
    default:
      break;
  }
};

const updateStatus = (status, lastResult) => {
  let statusStr = "";
  switch (status) {
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
      switch (lastResult) {
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
    case "STOPPED":
      statusStr = "You are already logged in elsewhere!";
      break;
    case "GAME_ERROR":
      statusStr = "Sorry, an error occured. Please refresh the page";
      break;
    default:
      break;
  }
  $gameStatus.text(statusStr);
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

const updatePlayerName = (name) => {
  $playerName.text(`${name} (you)`);
};

const updateOpponentName = (name) => {
  $opponentName.text(name ? name : "?");
};

const updateStats = (wins, losses, draws) => {
  $stats.text(`Wins: ${wins}, Losses: ${losses}, Draws: ${draws} (total)`);
};

const updateSocketStatus = (status) => {
  $socketStatus.text(status);
};

const updateGameNumber = (number) => {
  $gameNumber.text(`Game #${number}`);
};

const updateCurrentRoom = (room) => {
  $currentRoom.text(room ? `ROOM: ${room}` : "NOT IN ROOM");
};

const updateChat = (listItem) => {
  if ($("#chat-messages li").length > 100) {
    $chatMessages.find(":first-child").remove();
  }
  $chatMessages.append(listItem);
};

const updatePlayerChoice = (choice) => {
  $choicePlayer.attr("src", images[choice]);
};

const updateOpponentChoice = (choice) => {
  $choiceOpponent.attr("src", images[choice]);
};
