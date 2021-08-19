"use strict";
const handlePlayerButton = (choice) => {
  if (game.playerChoice) {
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
  $btnNewGame.prop("disabled", true);
  if (game.status === "START") {
    $btnNewGame.prop("disabled", true);
    socket.emit("queue");
    game.status = "QUEUE";
    updateDisplay(game);
  }

  if (game.status === "ENDED" || game.status === "OPPONENT_LEFT") {
    game.reset();
    leaveRoom(game.room);
    updatePlayerChoice("q");
    updateOpponentChoice("q");
    socket.emit("queue");
    game.status = "QUEUE";
    updateDisplay(game);
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
