"use strict";

socket.on("connected", (username) => {
  console.log("connected");

  game.playerName = username;

  $statusBar
    .removeClass("bg-danger")
    .removeClass("bg-secondary")
    .addClass("bg-success");

  game.socketStatus = "CONNECTED";
  updateDisplay(game);
});

socket.on("disconnect", (reason) => {
  console.log("disconnected");

  $btnPlayAgain.prop("disabled", false);
  $btnPlayCpu.prop("disabled", true);
  $btnQueue.prop("disabled", true);

  game.socketStatus = "DISCONNECTED";
  $statusBar.removeClass("bg-success").addClass("bg-danger");
  game.reset(socket);

  $choicePlayer.html(images["q"]);
  $choiceOpponent.html(images["q"]);

  updateDisplay(game);

  if (reason === "io server disconnect") {
    // manual disconnect by server, must manually reconnect
    game.socketStatus = "RECONNECTING";
    $statusBar.removeClass("bg-danger").addClass("bg-secondary");
    updateDisplay(game);
    socket.connect();
  }
  // socket will automatically try to reconnect
});

socket.on("joined room", (data) => {
  game.room = data.room;
  game.opponentName = data.opponent;
  game.status = "WAITING_BOTH";
  updateDisplay(game);
});

// messages sent by unnamed events
socket.on("message", (data) => {
  updateChat(
    $("<li>")
      .addClass("list-group-item")
      .text(`${data.username}: ${data.message}`)
  );
});

socket.on("room chat", (data) => {
  updateChat(
    $("<li>")
      .addClass("list-group-item-secondary")
      .text(`${data.username}: ${data.message}`)
  );
});

socket.on("general notification", (notification) => {
  updateChat(
    $("<li>").addClass("list-group-item-info").text(`${notification}`)
  );
});

socket.on("room notification", (notification) => {
  updateChat(
    $("<li>").addClass("list-group-item-danger").text(`${notification}`)
  );
});

socket.on("user notification", (data) => {
  console.log(data);
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
    updateOpponentChoice(game);
    game.processChoices(updateDisplay, updateDB);
  }

  if (game.status === "ENDED") {
    $btnPlayAgain.prop("disabled", false);
  }
});
