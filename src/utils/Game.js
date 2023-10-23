class Game{
    constructor() {
        this.currentPose = 0;
        this.partialScore = 0;
    }
    init(gameConfig){
        this.timer = gameConfig.timer;
        this.threshold = gameConfig.threshold;
        this.difficulty = gameConfig.difficulty;
        this.poses = gameConfig.poses;
    }
    start(){}
    stop(){}
    draw(){}
    update(){}
}