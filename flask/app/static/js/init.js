"use strict";

const $roundNumber = $("#round-number");
const $gameStatus = $("#game-status");
const $countdown = $("#countdown");
const $statusBar = $("#status-bar");
const $stats = $("#game-stats");
const $streak = $("#game-streak");
const $choicePlayer = $("#choice-player");
const $choiceOpponent = $("#choice-opponent");
const $socketStatus = $("#socket-status");
const $checkCpu = $("#check-cpu");
const $checkPvp = $("#check-pvp");

const $currentRoom = $("#current-room");
const $playerName = $("#player-name");
const $opponentName = $("#opponent-name");

const $chatroom = $("#chatroom");
const $chatMessages = $("#chat-messages");
const $btnToggleChat = $("#toggle-chat");
const $inputChat = $("#input-chat");
const $btnSendChat = $("#btn-send-chat");
const $checkRoomChat = $("#check-room-chat");

const $btnRock = $("#btn-rock");
const $btnPaper = $("#btn-paper");
const $btnScissors = $("#btn-scissors");
const $btnNewGame = $("#btn-new-game");

const images = {
  r: "./static/img/icons8-rock-80.png",
  p: "./static/img/icons8-paper-80.png",
  s: "./static/img/icons8-hand-scissors-80.png",
  q: "./static/img/icons8-question-mark-80.png",
  male: "./static/img/male.png",
  female: "./static/img/female.png",
};

$(document).ready(() => {
  // initialize bootstrap toasts
  const toastElList = [].slice.call(document.querySelectorAll(".toast"));
  const toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl);
  });
});

// initialize socketio
const socket = io();

// initialize game instance
const game = new Game();

const leaveRoom = (room) => {
  if (room) {
    // trigger server to initiate leave room
    socket.emit("leave room", { room });
  }
};

const fetchScores = async () => {
  try {
    return (await fetch("/scores")).json();
  } catch (error) {
    console.log(error);
  }
};

const updateDB = (result) => {
  // registered users can't have "#" in username
  if (game.playerName.includes("#")) {
    return;
  }

  $.ajax({
    type: "PUT",
    url: "/scores",
    contentType: "application/json",
    data: JSON.stringify({ result }),
  })
    .done((response) => console.log("DB updated"))
    .fail((response) => console.log("Error: could not update scores"));
};


