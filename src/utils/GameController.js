import { gameConfig } from "./gameConfig";
import { Game } from "./Game";
import tposeImage from "../poses/TPose.png";
import tpose from "../poses/tpose.json";

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
    this.ended = false;
    this.inTutorial = true;
    this.started = true;
  }

  init() {
    this.inTutorial = true;

    this.tutPose = tpose;
    this.tutImage = tposeImage;

    this.games[0] = new Game(gameConfig.easy, this);
    this.games[1] = new Game(gameConfig.medium, this);
    this.games[2] = new Game(gameConfig.hard, this);
  }

  getCurrentPose() {
    return this.inTutorial
      ? this.tutPose
      : this.getCurrentGame().getCurrentPose();
  }

  getCurrentImage() {
    return this.inTutorial
      ? this.tutImage
      : this.getCurrentGame().getCurrentImage();
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

  start() {
    this.globalTimer = 0;
    this.inTutorial = false;
    this.started = true;
    this.getCurrentGame().start();
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

  isGameEnded() {
    return this.ended;
  }

  isInTutorial() {
    return this.inTutorial;
  }

  isGameStarted() {
    return this.started;
  }
}

export { GameController };
