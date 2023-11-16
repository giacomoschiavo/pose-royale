class Game {
  constructor(difficulty, durationTimer, gc) {
    this.index = 0;
    this.durationTimer = durationTimer;
    this.difficulty = difficulty;
    this.currentImage = null;
    this.currentPose = null;
    // only for testing
    this.gc = gc;
    this.poses = this.gc.poses;
    this.images = this.gc.images;
  }

  start() {
    this.index = 0;
    this.currentPose = this.poses[this.index];
    this.currentImage = this.images[this.index];
  }
  stop() {}
  draw() {}
  update(passed) {
    // if (passed) {
    //   console.log(this.partialScore);
    //   this.partialScore++;
    //   this.index++;
    //   this.currentPose = this.poses[this.index];
    //   this.currentImage = this.images[this.index];
    // }
  }

  nextPose() {
    if (this.index === this.poses.length - 1) {
      console.log("Next Game should be called");
      this.gc.nextGame();
      return;
    }
    this.index++;
    this.currentPose = this.poses[this.index];
    this.currentImage = this.images[this.index];
  }

  getCurrentPose() {
    return this.currentPose;
  }

  getCurrentImage() {
    return this.currentImage;
  }
}

export { Game };
