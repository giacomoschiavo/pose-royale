class Game {
  constructor(difficulty, gc) {
    this.index = 0;
    this.partialScore = 0;
    // this.timer = timer;
    // this.threshold = threshold;
    this.difficulty = difficulty;
    this.gc = gc;
    this.currentImage = null;
    this.currentPose = null;
    this.poses = this.gc.poses;
    this.images = this.gc.images;
  }

  start() {
    this.currentPose = this.poses[this.index];
    this.currentImage = this.images[this.index];
  }
  stop() {}
  draw() {}
  update(passed) {
    if (passed) {
      this.partialScore++;
      this.index++;
      this.currentPose = this.poses[this.index];
      this.currentImage = this.images[this.index];
    }
  }
}

export { Game };
