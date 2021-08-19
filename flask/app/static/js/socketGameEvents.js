"use strict";

socket.on("connected", async (username) => {
  console.log("connected");
  $btnNewGame.prop("disabled", false);
  game.playerName = username;
  game.socketStatus = "CONNECTED";
  // const scores = await fetchScores();
  // Object.assign(game, scores);
  updateDisplay(game);
});

socket.on("disconnect", (reason) => {
  console.log("disconnected");

  $btnNewGame.prop("disabled", true);

  game.socketStatus = "DISCONNECTED";
  updateDisplay(game);

  leaveRoom(game.room);
  game.reset();

  $choicePlayer.html(images["q"]);
  $choiceOpponent.html(images["q"]);
  updateDisplay(game);
});

socket.on("joined room", (data) => {
  console.log(`You joined room: ${data.room}`);

  $btnNewGame.prop("disabled", true);
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
    updateDisplay(game);
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
  leaveRoom(game.room);
  game.reset();

  updateDisplay(game);

  $btnNewGame.prop("disabled", false);
  $choicePlayer.attr("src", images["q"]);
  $choiceOpponent.attr("src", images["q"]);
});

socket.on("left room", () => {
  console.log("You left the room");
  game.room = null;
  $btnNewGame.prop("disabled", false);
  $checkRoomChat.prop("disabled", true);
});

socket.on("already logged in", () => {
  console.log("You are already logged in another window or tab");
  socket.disconnect();
  game.status = "STOPPED";
  game.socketStatus = "STOPPED";
  updateDisplay(game);
});
