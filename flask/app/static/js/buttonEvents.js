"use strict";
const handlePlayerButton = (choice) => {
  if (game.playerChoice) {
    return;
  }

  if (game.type === "CPU" && game.status === "WAITING_PLAYER") {
    game.playerChoice = choice;
    updatePlayerChoice(game.playerChoice);
    endGame(game);
    return;
  }

  if (game.status === "WAITING_BOTH" || game.status === "WAITING_PLAYER") {
    if (!game.room) {
      game.status = "GAME_ERROR";
      updateDisplay(game);
      game.status = "STOPPED";
      console.log("ERROR_NOT_IN_ROOM");
      return;
    }

    game.playerChoice = choice;
    socket.emit("choice", { choice });
    updatePlayerChoice(game.playerChoice);

    // opponent hasn't made choice, wait for opponent
    if (game.status === "WAITING_BOTH") {
      game.status = "WAITING_OPPONENT";
      updateDisplay(game);
      return;
    }

    // opponent already made choice, determine winner
    if (game.status === "WAITING_PLAYER") {
      endGame(game);
    }
  }
};

$btnNewGame.on("click", (event) => {
  event.preventDefault();
  if (
    game.type === "PVP" &&
    (game.status === "WAITING_PLAYER" ||
      game.status === "WAITING_OPPONENT" ||
      game.status === "WAITING_BOTH")
  ) {
    // don't allow leaving a PVP game in progress
    return;
  }

  // CPU game
  if ($checkCpu.is(":checked")) {
    if (game.status === "START") {
      // start a new CPU game
    } else if (game.status === "ENDED") {
      // start a new game if an existing game has ended
      if (game.room) {
        leaveRoom(game.room);
      }
      game.reset();
    }
    game.status = "WAITING_PLAYER";
    game.type = "CPU";
    game.opponentName = "Skynet";
    updateDisplay(game);
    updatePlayerChoice("q");
    updateOpponentChoice("q");
    return;
  }

  // PVP game
  if ($checkPvp.is(":checked")) {
    $btnNewGame.prop("disabled", true);
    if (game.status === "START") {
      game.type = "PVP";
      $btnNewGame.prop("disabled", true);
      socket.emit("queue");
      game.status = "QUEUE";
      updateDisplay(game);
      updatePlayerChoice("q");
      updateOpponentChoice("q");
    } else if (
      game.type === "CPU" ||
      game.status === "ENDED" ||
      game.status === "OPPONENT_LEFT"
    ) {
      game.type = "PVP";
      $btnNewGame.prop("disabled", true);
      if (game.room) {
        leaveRoom(game.room);
      }
      game.reset();
      updatePlayerChoice("q");
      updateOpponentChoice("q");
      socket.emit("queue");
      game.status = "QUEUE";
      updateDisplay(game);
    }
  }
});

$("#input-chat").keyup((event) => {
  if (event.key === "Enter") {
    const message = $inputChat.val().trim();

    if (!message) {
      return;
    }

    if (game.room && $checkRoomChat.prop("checked")) {
      return socket.emit("room chat", {
        message,
        room: game.room,
      });
    }

    socket.emit("general chat", {
      message,
    });
  }
});

$btnSendChat.on("click", (event) => {
  event.preventDefault();

  const message = $inputChat.val().trim();

  if (!message) {
    return;
  }

  if (game.room && $checkRoomChat.prop("checked")) {
    return socket.emit("room chat", {
      message,
      room: game.room,
    });
  }

  socket.emit("general chat", {
    message,
  });
});

$btnToggleChat.on("click", (event) => {
  if ($chatroom.hasClass("show")) {
    $chatroom.toast("hide");
  } else if ($chatroom.hasClass("hide")) {
    $chatroom.toast("show");
  }
});

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
