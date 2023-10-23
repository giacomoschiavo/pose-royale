import { gameConfig } from "./gameConfig";
import { Game } from "./Game";

class GameController {
  constructor(canvasElement, canvasCtx) {
    this.games = [null, null, null];
    this.currentGame = null;
    this.globalScore = 0;
    this.globalTimer = 0;
    this.difficulty = 0;
  }

  init() {
    this.games[0] = new Game({ ...gameConfig.easy, poses: [], gc: this });
    this.games[1] = new Game({ ...gameConfig.medium, poses: [], gc: this });
    this.games[2] = new Game({ ...gameConfig.hard, poses: [], gc: this });
    this.currentGame = this.games[this.difficulty];
  }

  start() {
    this.currentGame.start();
  }

  stop() {
    this.currentGame.stop();
  }

  draw(canvasElement, canvasCtx) {
    this.currentGame.draw(canvasElement, canvasCtx);
  }

  update() {
    this.currentGame.update(this);
  }

  changeGame() {
    this.stop();
    this.currentGame = this.games[++this.difficulty];
    this.start();
  }
}

export { GameController };
