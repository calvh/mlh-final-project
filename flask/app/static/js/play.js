"use strict";

$(document).ready(() => {
  const socket = io();

  const $gameStatus = $("#game-status");
  const $statusBar = $("#status-bar");
  const $stats = $("#game-stats");
  const $choicePlayer = $("#choice-player");
  const $choiceOpponent = $("#choice-opponent");
  const $socketStatus = $("#socket-status");
  const $currentRoom = $("#current-room");
  const $playerName = $("#player-name");
  const $opponentName = $("#opponent-name");
  const $generalChatMessages = $("#general-chat-messages");
  const $roomChatMessages = $("#room-chat-messages");
  const $inputGeneralChat = $("#input-general-chat");
  const $inputRoomChat = $("#input-room-chat");

  const $btnRock = $("#btn-rock");
  const $btnPaper = $("#btn-paper");
  const $btnScissors = $("#btn-scissors");
  const $btnPlayAgain = $("#btn-play-again");
  const $btnPlayCpu = $("#btn-play-cpu");
  const $btnQueue = $("#btn-queue");
  const $btnSendGeneralChat = $("#btn-send-general-chat");
  const $btnSendRoomChat = $("#btn-send-room-chat");

  const images = {
    r: "./static/img/icons8-rock-80.png",
    p: "./static/img/icons8-paper-80.png",
    s: "./static/img/icons8-hand-scissors-80.png",
    q: "./static/img/icons8-question-mark-80.png",
    male: "./static/img/male.png",
    female: "./static/img/female.png",
  };

  class Game {
    constructor() {
      this.status = "CHOOSE_GAME_TYPE";
      this.socketStatus = "DISCONNECTED";
      this.playerName = null;
      this.gameType = null;
      this.room = null;
      this.opponentName = null;
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
        this.opponentName = null;
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
        case "WAITING_PLAYER":
        case "WAITING_OPPONENT":
          if (this.playerChoice && this.opponentChoice) {
            const c1 = this.playerChoice;
            const c2 = this.opponentChoice;
            updateOpponentChoice();
            const result = Game.calculateResult(c1, c2);

            switch (result) {
              case "w":
                this.wins += 1;
                break;
              case "l":
                this.losses += 1;
                break;
              case "d":
                this.draws += 1;
                break;
              default:
                // error
                console.log(result);
                break;
            }

            this.status = "ENDED";
            updateDisplay();
          }
          break;

        default:
          // do nothing
          break;
      }
    }
  }

  const game = new Game();

  socket.on("status change", (data) => {
    $socketStatus.text(data.status);
  });

  const updatePlayerChoice = () => {
    $choicePlayer.attr("src", images[game.playerChoice]);
  };

  const updateOpponentChoice = () => {
    $choiceOpponent.attr("src", images[game.opponentChoice]);
  };

  const updateDisplay = () => {
    $gameStatus.text(game.status);
    $socketStatus.text(game.socketStatus);
    $currentRoom.text(`ROOM: ${game.room}`);
    $playerName.text(`${game.playerName} (you)`);
    $opponentName.text(`${game.opponentName}`);
    $stats.text(
      `Wins: ${game.wins}, Losses: ${game.losses}, Draws: ${game.draws}`
    );
  };

  $btnPlayAgain.on("click", (event) => {
    event.preventDefault();
    $btnPlayCpu.prop("disabled", false);
    $btnQueue.prop("disabled", false);
    $btnPlayAgain.prop("disabled", true);
    game.reset(socket);
    updateDisplay();
    $choicePlayer.attr("src", images["q"]);
    $choiceOpponent.attr("src", images["q"]);
  });

  $btnLeaveRoom.on("click", (event) => {
    event.preventDefault();
    game.leaveRoom();
  });

  // automatically make choice for CPU
  $btnPlayCpu.on("click", (event) => {
    event.preventDefault();
    if (game.status === "CHOOSE_GAME_TYPE") {
      $btnPlayCpu.prop("disabled", true);
      $btnQueue.prop("disabled", true);
      $choicePlayer.attr("src", images["q"]);
      $choiceOpponent.attr("src", images["q"]);
      game.opponentName = "CPU";
      game.gameType = "CPU";
      game.opponentChoice = Game.cpuChoose();
      game.status = "WAITING_PLAYER";
      updateDisplay();
    }
  });

  $btnQueue.on("click", (event) => {
    event.preventDefault();
    if (game.status === "CHOOSE_GAME_TYPE") {
      $btnPlayCpu.prop("disabled", true);
      $btnQueue.prop("disabled", true);
      $choicePlayer.attr("src", images["q"]);
      $choiceOpponent.attr("src", images["q"]);
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
      if (game.status === "ENDED") {
        $btnPlayAgain.prop("disabled", false);
      }
    }

    // vs human
    if (game.status === "WAITING_BOTH" || game.status === "WAITING_PLAYER") {
      if (game.room) {
        game.playerChoice = choice;
        socket.emit("choice", { choice });
        updatePlayerChoice();

        if (game.status === "WAITING_BOTH") {
          game.status = "WAITING_OPPONENT";
          updateDisplay();
        }
        game.processChoices();
        if (game.status === "ENDED") {
          $btnPlayAgain.prop("disabled", false);
        }
      } else {
        console.log("ERROR_NOT_IN_ROOM");
      }
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

  socket.on("connect", () => {
    console.log("connected");
    $statusBar
      .removeClass("bg-danger")
      .removeClass("bg-secondary")
      .addClass("bg-success");
    game.playerName = socket.id;
    game.socketStatus = "CONNECTED";
    updateDisplay();
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
    updateDisplay();

    // TODO implement proper correction measures on frontend and backend
    if (reason === "io server disconnect") {
      // the disconnection was initiated by the server, you need to reconnect manually
      game.socketStatus = "RECONNECTING";
      $statusBar.removeClass("bg-danger").addClass("bg-secondary");
      updateDisplay();
      socket.connect();
    }
    // else the socket will automatically try to reconnect
  });

  socket.on("joined room", (data) => {
    game.room = data.room;
    game.opponentName = data.opponent;
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

  socket.on("choice", (data) => {
    game.opponentChoice = data.choice;
    if (game.status === "WAITING_BOTH") {
      game.status = "WAITING_PLAYER";
      updateDisplay();
    }
    game.processChoices();
    if (game.status === "ENDED") {
      $btnPlayAgain.prop("disabled", false);
    }
  });
});
