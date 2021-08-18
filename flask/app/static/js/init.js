"use strict";

const $gameStatus = $("#game-status");
const $statusBar = $("#status-bar");
const $stats = $("#game-stats");
const $choicePlayer = $("#choice-player");
const $choiceOpponent = $("#choice-opponent");
const $socketStatus = $("#socket-status");
const $currentRoom = $("#current-room");
const $playerName = $("#player-name");
const $opponentName = $("#opponent-name");

const $chatroom = $("#chatroom");
const $chatMessages = $("#chat-messages");
const $btnToggleChat = $("#toggle-chat");
const $inputChat = $("#input-chat");
const $btnSendGeneralChat = $("#btn-send-general-chat");
const $btnSendRoomChat = $("#btn-send-room-chat");

const $btnRock = $("#btn-rock");
const $btnPaper = $("#btn-paper");
const $btnScissors = $("#btn-scissors");
const $btnPlayAgain = $("#btn-play-again");
const $btnPlayCpu = $("#btn-play-cpu");
const $btnQueue = $("#btn-queue");

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
