import { gameConfig } from "./gameConfig";
import { Game } from "./Game";
import tpose from "../poses/tpose.json";
import crab from "../poses/crab.json";
import nail from "../poses/nail.json";
import star from "../poses/star.json";
import rightLegRaise from "../poses/rightlegraise.json";
import tposeImage from "../poses/TPose.png";
import crabImage from "../poses/crab.png";
import nailImage from "../poses/nailpose.png";
import starImage from "../poses/starPose.png";
import rightLegRaiseImage from "../poses/rightlegraise.png";

class GameController {
  constructor() {
    this.games = [null, null, null];
    this.currentGame = null;
    this.globalScore = 0;
    this.globalTimer = 0;
    this.difficulty = 0;
    this.poses = [];
    this.images = [];
  }

  init() {
    this.poses = [tpose, crab, nail, star, rightLegRaise];
    this.images = [
      tposeImage,
      crabImage,
      nailImage,
      starImage,
      rightLegRaiseImage,
    ];

    this.games[0] = new Game(0, 10, this);
    this.games[1] = new Game(1, 8, this);
    this.games[2] = new Game(2, 5, this);
    this.currentGame = this.games[this.difficulty];
  }

  getCurrentPose() {
    return this.currentGame.getCurrentPose();
  }

  getCurrentImage() {
    return this.currentGame.getCurrentImage();
  }

  getDurationTimer() {
    return this.currentGame.durationTimer;
  }

  start() {
    this.currentGame.start(); // initialize the first pose
    this.globalTimer = 0;
  }

  stop() {
    this.currentGame.stop(); // not implemented yet
  }

  draw(canvasElement, canvasCtx) {
    this.currentGame.draw(canvasElement, canvasCtx);
  }

  update(detect) {
    this.currentGame.update(detect);
  }

  nextPose() {
    this.currentGame.nextPose();
  }

  nextGame() {
    if (this.difficulty === this.games.length - 1) {
      console.log("Game Over");
      return;
    }
    this.currentGame = this.games[++this.difficulty];
    this.currentGame.start();
  }
}

export { GameController };
