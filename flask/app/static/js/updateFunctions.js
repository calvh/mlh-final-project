"use strict";
const endGame = (game) => {
  if (game.type === "CPU") {
    game.opponentChoice = Game.cpuChoose();
  }
  updateOpponentChoice(game.opponentChoice);

  game.processChoices();

  updateDB(game.lastResult);
  updateStatus(game.status, game.lastResult);
  updateStats(game.wins, game.losses, game.draws);
  updateAnnouncement(game.streak);

  continueNextGame(game);
};

const continueNextGame = (game) => {
  updateCountdown();

  setTimeout(() => {
    // handle opponent leaving during timeout
    if (game.type === "CPU") {
      game.status = "WAITING_PLAYER";
    } else if (game.room) {
      game.status = "WAITING_BOTH";
    }
    $countdown.text("");
    game.roundNumber += 1;
    updateDisplay(game);
    updatePlayerChoice("q");
    updateOpponentChoice("q");
  }, 3000);
};

const updateDisplay = (game) => {
  updateStatus(game.status, game.lastResult);
  updateStatusBar(game.socketStatus);
  updateRoundNumber(game.roundNumber);
  updateSocketStatus(game.socketStatus);
  updateCurrentRoom(game.room);
  updatePlayerName(game.playerName);
  updateOpponentName(game.opponentName);
  updateStreak(game.streak);
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
      statusStr = "Click New Game to find an opponent!";
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
      statusStr = "Your opponent left! Click New Game";
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
    $countdown.text(`Next round in ${t}`);
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

const updateRoundNumber = (number) => {
  $roundNumber.text(`Round #${number}`);
};

const updateCurrentRoom = (room) => {
  $currentRoom.text(room ? `ROOM: ${room}` : "NOT IN ROOM");
};

const updateAnnouncement = (streak) => {
  let announcement = "";
  switch (streak) {
    case 0:
    case 1:
    case 2:
      announcement = `Streak: ${streak}`;
      break;
    case 3:
      announcement = "RPS SPREE!";
      break;
    case 4:
      announcement = "RAMPAGE!";
      break;
    case 5:
      announcement = "UNSTOPPABLE!";
      break;
    case 6:
      announcement = "DOMINATING!";
      break;
    case 7:
      announcement = "GODLIKE!";
      break;
    case 8:
      announcement = "LEGENDARY!";
      break;
    default:
      announcement = "LEGENDARY!";
      break;
  }
  $streak.text(announcement);
};

const updateStreak = (streak) => {
  $streak.text(`Streak: ${streak}`);
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
