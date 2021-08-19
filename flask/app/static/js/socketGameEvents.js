"use strict";

socket.on("connected", (username) => {
  console.log("connected");
  game.playerName = username;
  game.socketStatus = "CONNECTED";
  updateDisplay(game);
});

socket.on("disconnect", (reason) => {
  console.log("disconnected");

  $btnNewGame.prop("disabled", false);

  game.socketStatus = "DISCONNECTED";
  updateDisplay(game);

  game.reset();
  leaveRoom(game.room);

  $choicePlayer.html(images["q"]);
  $choiceOpponent.html(images["q"]);
  updateDisplay(game);
});

socket.on("joined room", (data) => {
  console.log(`You joined room: ${data.room}`);

  $checkRoomChat.prop("disabled", false);

  game.room = data.room;
  game.opponentName = data.opponent;
  game.status = "WAITING_BOTH";

  updateDisplay(game);
});

socket.on("choice", (data) => {
  console.log(`Your opponent chose ${data.choice}`);
  game.opponentChoice = data.choice;

  // player hasn't made choice, wait for player
  if (game.status === "WAITING_BOTH") {
    game.status = "WAITING_PLAYER";
    updateStatus(game.status);
    return;
  }

  // player already made choice, determine winner
  if (game.status === "WAITING_OPPONENT") {
      endGame(game);
  }
});

socket.on("opponent left", () => {
  console.log("Your opponent left.");
  game.status = "OPPONENT_LEFT";
  game.reset();
  leaveRoom(game.room);

  updateDisplay(game);

  $btnNewGame.prop("disabled", false);
  $choicePlayer.attr("src", images["q"]);
  $choiceOpponent.attr("src", images["q"]);
});

socket.on("left room", () => {
  console.log("You left the room");
  $checkRoomChat.prop("disabled", true);
});

socket.on("already logged in", () => {
  console.log("You are already logged in another window or tab");
  socket.disconnect();
  game.status = "STOPPED";
  game.socketStatus = "STOPPED";
  updateDisplay(game);
});
