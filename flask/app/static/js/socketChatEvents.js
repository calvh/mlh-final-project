"use strict";

// messages sent by unnamed events
socket.on("message", (data) => {
  updateChat(
    $("<li>")
      .addClass("list-group-item list-group-item-action text-start")
      .text(`${data.username}: ${data.message}`)
  );
});

socket.on("room chat", (data) => {
  updateChat(
    $("<li>")
      .addClass("list-group-item list-group-item-secondary list-group-item-action text-start")
      .text(`${data.username}: ${data.message}`)
  );
});

socket.on("general notification", (notification) => {
  updateChat(
    $("<li>").addClass("list-group-item list-group-item-info list-group-item-action").text(`${notification}`)
  );
});

socket.on("room notification", (notification) => {
  updateChat(
    $("<li>").addClass("list-group-item list-group-item-danger list-group-item-action").text(`${notification}`)
  );
});

socket.on("user notification", (data) => {
  console.log(data);
});
