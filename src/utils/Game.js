// easy: {
//   difficulty: 0,
//   timer: 10,
//   threshold: 5,
// }

class Game {
  constructor(difficulty, timer, threshold, gc) {
    this.indexPose = 0;
    this.started = false;
    this.paused = false;
    this.stopped = false;
    this.partialScore = 0;
    this.timer = timer;
    this.gc = gc;
    this.threshold = threshold;
    this.difficulty = difficulty;
    this.currentImage = null;
    this.currentPose = null;
    // only for testing
    this.poses = this.gc.poses;
    this.images = this.gc.images;
    this.currentPose = this.poses[this.indexPose];
    this.currentImage = this.images[this.indexPose];
  }

  start() {
    this.started = true;
  }

  pause() {
    this.paused = true;
  }

  nextPose() {
    this.indexPose++;
    if (this.indexPose >= this.poses.length) {
      this.indexPose = 0;
      console.log("Next Game should be called");
      this.stopped = true;
      this.gc.nextGame();
      return;
    }
    this.currentPose = this.poses[this.indexPose];
    this.currentImage = this.images[this.indexPose];
  }

  getCurrentPose() {
    return this.currentPose;
  }

  getCurrentImage() {
    return this.currentImage;
  }
}

export { Game };
