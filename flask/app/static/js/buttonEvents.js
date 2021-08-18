"use strict";
const handlePlayerButton = (choice) => {
  if (game.playerChoice) {
    return;
  }

  if (game.gameType === "CPU") {
    game.playerChoice = choice;
    updatePlayerChoice(game);
    game.processChoices(updateDisplay, updateDB);
    if (game.status === "ENDED") {
      $btnPlayAgain.prop("disabled", false);
    }
  }

  // human opponent
  if (game.status === "WAITING_BOTH" || game.status === "WAITING_PLAYER") {
    if (!game.room) {
      console.log("ERROR_NOT_IN_ROOM");
      return;
    }

    game.playerChoice = choice;
    socket.emit("choice", { choice });
    updatePlayerChoice(game);

    // opponent hasn't made choice, wait for opponent
    if (game.status === "WAITING_BOTH") {
      game.status = "WAITING_OPPONENT";
      updateDisplay(game);
      return;
    }

    if (game.status === "WAITING_PLAYER") {
      updateOpponentChoice(game);
      game.processChoices(updateDisplay, updateDB);
    }

    if (game.status === "ENDED") {
      $btnPlayAgain.prop("disabled", false);
    }
  }
};

$btnRock.on("click", (event) => {
  event.preventDefault();
  handlePlayerButton("r");
});

$btnPaper.on("click", (event) => {
  event.preventDefault();
  handlePlayerButton("p");
});

$btnScissors.on("click", (event) => {
  event.preventDefault();
  handlePlayerButton("s");
});

$btnQueue.on("click", (event) => {
  event.preventDefault();
  if (game.status === "CHOOSE_GAME_TYPE") {
    $btnPlayCpu.prop("disabled", true);
    $btnQueue.prop("disabled", true);
    $choicePlayer.attr("src", images["q"]);
    $choiceOpponent.attr("src", images["q"]);
    socket.emit("queue");
    game.status = "QUEUE";
    updateDisplay(game);
  }
});
$btnPlayCpu.on("click", (event) => {
  event.preventDefault();
  if (game.status === "CHOOSE_GAME_TYPE") {
    $btnPlayCpu.prop("disabled", true);
    $btnQueue.prop("disabled", true);
    $choicePlayer.attr("src", images["q"]);
    $choiceOpponent.attr("src", images["q"]);
    game.opponentName = "CPU";
    game.gameType = "CPU";
    game.opponentChoice = Game.cpuChoose();
    game.status = "WAITING_PLAYER";
    updateDisplay(game);
  }
});

$btnPlayAgain.on("click", (event) => {
  event.preventDefault();
  $btnPlayCpu.prop("disabled", false);
  $btnQueue.prop("disabled", false);
  $btnPlayAgain.prop("disabled", true);
  game.reset(socket);
  updateDisplay(game);
  $choicePlayer.attr("src", images["q"]);
  $choiceOpponent.attr("src", images["q"]);
});

$btnSendGeneralChat.on("click", (event) => {
  event.preventDefault();

  const message = $inputChat.val().trim();

  if (message) {
    socket.emit("general chat", {
      message,
    });
  }
});

$btnSendRoomChat.on("click", (event) => {
  event.preventDefault();

  const message = $inputChat.val().trim();

  if (game.room && message) {
    socket.emit("room chat", {
      message,
      room: game.room,
    });
  }
});

$btnToggleChat.on("click", (event) => {
  if ($chatroom.hasClass("show")) {
    $chatroom.toast("hide");
  } else if ($chatroom.hasClass("hide")) {
    $chatroom.toast("show");
  }
});
