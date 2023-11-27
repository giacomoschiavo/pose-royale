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
    this.globalScore = 0;
    this.globalTimer = 0;
    this.difficulty = 0;
    this.poses = [];
    this.images = [];
    this.ended = false;
  }

  init() {
    this.poses = [tpose, crab];
    this.images = [
      tposeImage,
      crabImage,
      nailImage,
      starImage,
      rightLegRaiseImage,
    ];

    this.games[0] = new Game(gameConfig.easy, this);
    this.games[1] = new Game(gameConfig.medium, this);
    this.games[2] = new Game(gameConfig.hard, this);
  }

  getCurrentPose() {
    return this.getCurrentGame().getCurrentPose();
  }

  getCurrentImage() {
    return this.getCurrentGame().getCurrentImage();
  }

  getGameTimer() {
    return this.getCurrentGame().timer;
  }

  getDifficulty() {
    return this.getCurrentGame().difficulty;
  }

  getCurrentGame() {
    return this.games[this.difficulty];
  }

  start(fn) {
    this.globalTimer = 0;
    this.getCurrentGame().start();
    fn();
  }

  pause() {
    this.getCurrentGame().pause();
  }

  nextPose() {
    this.getCurrentGame().nextPose();
  }

  nextGame() {
    if (this.difficulty + 1 >= this.games.length) {
      console.log("Game Over");
      this.ended = true;
      return;
    }
    this.difficulty++;
    this.getCurrentGame().start();
  }
}

export { GameController };
