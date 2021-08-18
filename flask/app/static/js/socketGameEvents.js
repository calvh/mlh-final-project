"use strict";

socket.on("connected", (username) => {
  console.log("connected");

  game.playerName = username;
  game.socketStatus = "CONNECTED";
  updateStatusBar(game.socketStatus);
  updateDisplay(game);
});

socket.on("disconnect", (reason) => {
  console.log("disconnected");

  $btnNewGame.prop("disabled", false);

  game.socketStatus = "DISCONNECTED";
  updateStatusBar(game.socketStatus);
  game.reset();
  leaveRoom(game.room);

  $choicePlayer.html(images["q"]);
  $choiceOpponent.html(images["q"]);

  updateDisplay(game);

  if (reason === "io server disconnect") {
    // manual disconnect by server, must manually reconnect
    game.socketStatus = "RECONNECTING";
    updateStatusBar(game.socketStatus);
    updateDisplay(game);
    socket.connect();
  }
  // socket will automatically try to reconnect
});

socket.on("joined room", (data) => {
  game.room = data.room;
  game.opponentName = data.opponent;
  $checkRoomChat.prop("disabled", false);
  game.status = "WAITING_BOTH";
  updateDisplay(game);
});

socket.on("choice", (data) => {
  game.opponentChoice = data.choice;

  // player hasn't made choice, wait for player
  if (game.status === "WAITING_BOTH") {
    game.status = "WAITING_PLAYER";
    updateDisplay(game);
    return;
  }

  // player already made choice
  if (game.status === "WAITING_OPPONENT") {
    updateOpponentChoice(game.opponentChoice);
    game.processChoices();
    updateDB(game.result);
    updateDisplay(game);
    continueNextGame();
  }
});

socket.on("opponent left", () => {
  game.status = "OPPONENT_LEFT";
  updateDisplay(game);
  game.reset();
  leaveRoom(game.room);
  $btnNewGame.prop("disabled", false);
  $choicePlayer.attr("src", images["q"]);
  $choiceOpponent.attr("src", images["q"]);
});

socket.on("left room", () => {
  $checkRoomChat.prop("disabled", true);
  game.room = null;
  updateDisplay(game);
});
