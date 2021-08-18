"use strict";

class Game {
  constructor() {
    this.status = "CHOOSE_GAME_TYPE";
    this.socketStatus = "DISCONNECTED";
    this.playerName = null;
    this.lastResult = null;
    this.gameType = null;
    this.room = null;
    this.opponentName = null;
    this.opponentChoice = null;
    this.playerChoice = null;
    this.wins = 0;
    this.losses = 0;
    this.draws = 0;
  }

  set setWins(newWin) {
    this._wins = newWin;
  }
  set setLosses(newLoss) {
    this._losses = newLoss;
  }
  set setDraws(newDraw) {
    this._draws = newDraw;
  }
  get getWins() {
    return this._wins;
  }
  get getLosses() {
    return this._losses;
  }
  get getDraws() {
    return this._draws;
  }

  allScores() {
    const game_score = {
      wins: this.getWins,
      losses: this.getLosses,
      draws: this.getDraws,
    };
    return game_score;
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

  // processChoices is called in 3 cases:
  // CPU game: player makes a choice
  // Human game: player makes a choice when their opponent already made choice
  // Human game: opponent makes a choice (triggered through socket event), when the player has already made their choice
  processChoices(updateDisplayFunction, updateDBFunction) {
    switch (this.status) {
      case "WAITING_PLAYER":
      case "WAITING_OPPONENT":
        if (this.playerChoice && this.opponentChoice) {
          const c1 = this.playerChoice;
          const c2 = this.opponentChoice;
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
              break;
          }
          this.status = "ENDED";
          this.lastResult = result;
          updateDBFunction(result);
          updateDisplayFunction(this);
        }

      default:
        // when game.status is one of:
        // "CHOOSE_GAME_TYPE", "WAITING_BOTH", "ENDED"
        // do nothing
        break;
    }
  }
}
