"use strict";

$(document).ready(() => {
  const $socketId = $("#socket-id");

  const $socketStatus = $("#socket-status");

  const $currentRoom = $("#current-room");
  const $opponent = $("#opponent");
  const $btnLeaveRoom = $("#btn-leave-room");
  const $btnQueue = $("#btn-queue");

  const $generalChatMessages = $("#general-chat-messages");
  const $inputGeneralChat = $("#input-general-chat");
  const $btnSendGeneralChat = $("#btn-send-general-chat");

  const $roomChatMessages = $("#room-chat-messages");
  const $inputRoomChat = $("#input-room-chat");
  const $btnSendRoomChat = $("#btn-send-room-chat");

  let room = null;
  let opponent = null;

  const socket = io();

  const generateRandomString = (length = 6) =>
    Math.random().toString(20).substr(2, length);

  // trigger server to initiate leave room
  const leaveRoom = (room) => {
    if (room) {
      socket.emit("leave", { room });

      $currentRoom.text("null");
      $opponent.text("null");

      room = null;
      opponent = null;
    }
  };

  $socketStatus.text("disconnected");

  $btnLeaveRoom.on("click", (event) => {
    event.preventDefault();
    leaveRoom(room);
  });

  $btnQueue.on("click", (event) => {
    event.preventDefault();
    socket.emit("queue");
  });

  $btnSendGeneralChat.on("click", (event) => {
    event.preventDefault();

    const message = $inputGeneralChat.val().trim();

    if (message) {
      socket.emit("general chat", {
        message,
      });
    }
  });

  $btnSendRoomChat.on("click", (event) => {
    event.preventDefault();

    const message = $inputRoomChat.val().trim();

    if (room && message) {
      socket.emit("room chat", {
        message,
        room,
      });
    }
  });

  socket.on("connect", () => {
    $socketStatus.text("CONNECTED");
  });

  socket.on("status change", (data) => {
    $socketStatus.text(data.status);
  });

  socket.on("disconnect", () => {
    $socketStatus.text("disconnected");
    $currentRoom.text("null");
    $opponent.text("null");
    room = null;
    opponent = null;
  });

  // messages sent by unnamed events
  socket.on("message", (data) => {
    const listHTML = `<li class="chat">${data.username}: ${data.message}</li>`;
    $generalChatMessages.append(listHTML);
  });

  socket.on("room chat", (data) => {
    const listHTML = `<li class="chat">${data.username}: ${data.message}</li>`;
    $roomChatMessages.append(listHTML);
  });

  socket.on("general notification", (notification) => {
    const listHTML = `<li class="notification">${notification}</li>`;
    $generalChatMessages.append(listHTML);
  });

  socket.on("room notification", (notification) => {
    const listHTML = `<li class="notification">${notification}</li>`;
    $roomChatMessages.append(listHTML);
  });

  socket.on("user notification", (data) => {
    console.log(data);
  });

  socket.on("joined room", (data) => {
    room = data.room;
    opponent = data.opponent;
    $currentRoom.text(room);
    $opponent.text(opponent);
  });
});
