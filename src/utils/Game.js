class Game {
  constructor(timer, threshold, difficulty, poses, gc) {
    this.currentPose = 0;
    this.partialScore = 0;
    this.timer = timer;
    this.threshold = threshold;
    this.difficulty = difficulty;
    this.poses = poses;
    this.gc = gc;
  }

  start() {}
  stop() {}
  draw() {}
  update() {}
}

export { Game };
