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

// questa classe deve essere mantenuta come read only
// nessun valore deve essere modificato
// lo stato di tutto il gioco è regolato da GameManager
// menntre GameController e Game fungono da struttura
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

    this.games[0] = new Game(
      gameConfig.easy.difficulty,
      gameConfig.easy.timer,
      gameConfig.easy.threshold,
      this
    );
    this.games[1] = new Game(
      gameConfig.medium.difficulty,
      gameConfig.medium.timer,
      gameConfig.medium.threshold,
      this
    );
    this.games[2] = new Game(
      gameConfig.hard.difficulty,
      gameConfig.hard.timer,
      gameConfig.hard.threshold,
      this
    );
    this.currentGame = this.games[this.difficulty];
  }

  getCurrentPose() {
    return this.currentGame.getCurrentPose();
  }

  getCurrentImage() {
    return this.currentGame.getCurrentImage();
  }

  getGameTimer() {
    return this.currentGame.timer;
  }

  start(fn) {
    this.globalTimer = 0;
    this.currentGame.start();
    fn();
  }

  pause() {
    this.currentGame.pause();
  }

  nextPose() {
    this.currentGame.nextPose();
  }

  nextGame() {
    this.difficulty++;
    if (this.difficulty >= this.games.length) {
      console.log("Game Over");
      this.currentGame.stop();
      return;
    }
    this.currentGame = this.games[++this.difficulty];
    this.currentGame.start();
  }
}

export { GameController };
