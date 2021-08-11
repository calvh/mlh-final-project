"use strict";

$(document).ready(() => {
  const socket = io();

  const $statusDisplay = $("#status");
  const $choicePlayer = $("#choice-player");
  const $choiceOpponent = $("#choice-opponent");
  const $socketId = $("#socket-id");
  const $socketStatus = $("#socket-status");
  const $currentRoom = $("#current-room");
  const $opponent = $("#opponent");
  const $generalChatMessages = $("#general-chat-messages");
  const $roomChatMessages = $("#room-chat-messages");
  const $inputGeneralChat = $("#input-general-chat");
  const $inputRoomChat = $("#input-room-chat");

  const $btnRock = $("#btn-rock");
  const $btnPaper = $("#btn-paper");
  const $btnScissors = $("#btn-scissors");
  const $btnPlayAgain = $("#btn-play-again");
  const $btnPlayCpu = $("#btn-play-cpu");
  const $btnLeaveRoom = $("#btn-leave-room");
  const $btnQueue = $("#btn-queue");
  const $btnSendGeneralChat = $("#btn-send-general-chat");
  const $btnSendRoomChat = $("#btn-send-room-chat");

  const imgMale = `<img src="./static/img/male.png" style="border-radius:50%; height: 300px; width: 300px;"></img>`;
  const imgFemale = `<img src="./static/img/female.png" style="border-radius:50%; height: 300px; width: 300px;"></img>`;
  const imgRock = `<img src="./static/img/icons8-rock-80.png"></img>`;
  const imgPaper = `<img src="./static/img/icons8-paper-80.png"></img>`;
  const imgScissors = `<img src="./static/img/icons8-hand-scissors-80.png"></img>`;
  const imgQuestion = `<img src="./static/img/icons8-question-mark-80.png"></img>`;
  const images = {
    r: imgRock,
    p: imgPaper,
    s: imgScissors,
    q: imgQuestion,
    male: imgMale,
    female: imgFemale,
  };

  class Game {
    constructor() {
      this.status = "CHOOSE_GAME_TYPE";
      this.socketStatus = "DISCONNECTED";
      this.gameType = null;
      this.room = null;
      this.opponent = null;
      this.opponentChoice = null;
      this.playerChoice = null;
      this.wins = 0;
      this.losses = 0;
      this.draws = 0;
    }

    leaveRoom(socket) {
      if (this.room) {
        // trigger server to initiate leave room
        socket.emit("leave", { room: this.room });
      }
    }

    reset(socket) {
      if (this.status === "ENDED") {
        this.leaveRoom(socket);
        this.status = "CHOOSE_GAME_TYPE";
        this.gameType = null;
        this.room = null;
        this.opponent = null;
        this.opponentChoice = null;
        this.playerChoice = null;
      }
    }

    static calculateResult(c1, c2) {
      // returns result for c1
      if (c1 === c2) {
        return "d";
      }

      const cases = {
        rs: "w",
        pr: "w",
        sp: "w",
        ps: "l",
        rp: "l",
        sr: "l",
      };

      const result = cases[c1 + c2];
      return result ? result : "ERROR_INVALID_CHOICE";
    }

    static cpuChoose() {
      const choices = ["r", "p", "s"];
      return choices[Math.floor(Math.random() * choices.length)];
    }

    processChoices() {
      switch (this.status) {
        case "WAITING_BOTH":
          if (this.playerChoice) {
            this.status = "WAITING_2";
          } else if (this.opponentChoice) {
            this.status = "WAITING_1";
          }
        case "WAITING_1":
        case "WAITING_2":
          if (this.playerChoice && this.opponentChoice) {
            const c1 = this.playerChoice;
            const c2 = this.opponentChoice;
            updateOpponentChoice();
            const result = Game.calculateResult(c1, c2);

            if (result === "w") {
              this.wins += 1;
            }

            if (result === "l") {
              this.losses += 1;
            }

            if (result === "d") {
              this.draws += 1;
            }

            this.status = "ENDED";
            updateDisplay();
          }

        default:
          // do nothing
          return;
      }
    }
  }

  const game = new Game();

  socket.on("status change", (data) => {
    $socketStatus.text(data.status);
  });

  const updatePlayerChoice = () => {
    $choicePlayer.html(images[game.playerChoice]);
  };

  const updateOpponentChoice = () => {
    $choiceOpponent.html(images[game.opponentChoice]);
  };

  const updateDisplay = () => {
    $statusDisplay.text(game.status);
    $socketStatus.text(game.socketStatus);
    $currentRoom.text(game.room);
    $opponent.text(game.opponent);
  };

  socket.on("choice", (data) => {
    game.opponentChoice = data.choice;
    if (game.status === "WAITING_BOTH") {
      game.status = "WAITING_1";
    }
    game.processChoices();
  });

  $btnPlayAgain.on("click", (event) => {
    event.preventDefault();
    game.reset(socket);
    updateDisplay();
    $choicePlayer.html(images["q"]);
    $choiceOpponent.html(images["q"]);
  });

  $btnLeaveRoom.on("click", (event) => {
    event.preventDefault();
    game.leaveRoom();
  });

  // automatically make choice for CPU
  $btnPlayCpu.on("click", (event) => {
    event.preventDefault();
    if (game.status === "CHOOSE_GAME_TYPE") {
      $choicePlayer.html(images["q"]);
      $choiceOpponent.html(images["q"]);
      game.gameType = "CPU";
      game.opponentChoice = Game.cpuChoose();
      game.status = "WAITING_1";
      updateDisplay();
    }
  });

  $btnQueue.on("click", (event) => {
    if (game.status === "CHOOSE_GAME_TYPE") {
      $choicePlayer.html(images["q"]);
      event.preventDefault();
      $choicePlayer.html(images["q"]);
      $choiceOpponent.html(images["q"]);
      socket.emit("queue");
      game.status = "QUEUE";
      updateDisplay();
    }
  });

  const handlePlayerButton = (choice) => {
    if (game.playerChoice) {
      return;
    }

    if (game.gameType === "CPU") {
      game.playerChoice = choice;
      updatePlayerChoice();
      game.processChoices();
    }

    // vs human
    if (game.room) {
      game.playerChoice = choice;
      socket.emit("choice", { choice });
      updatePlayerChoice();

      if (game.status === "WAITING_BOTH") {
        game.status = "WAITING_2";
      }

      game.processChoices();
    }
  };
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

  socket.on("connect", () => {
    game.socketStatus = "CONNECTED";
    updateDisplay();
  });

  socket.on("disconnect", (reason) => {
    game.socketStatus = "DISCONNECTED";
    if (reason === "io server disconnect") {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket.connect();
      game.reset(socket);
      updateDisplay();
      $choicePlayer.html(images["q"]);
      $choiceOpponent.html(images["q"]);
    }
    // else the socket will automatically try to reconnect
  });

  socket.on("joined room", (data) => {
    game.room = data.room;
    game.opponent = data.opponent;
    game.status = "WAITING_BOTH";
    updateDisplay();
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

    if (game.room && message) {
      socket.emit("room chat", {
        message,
        room: game.room,
      });
    }
  });
});
