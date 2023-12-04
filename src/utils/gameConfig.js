import tpose from "../poses/tpose.json";
import crab from "../poses/crab.json";
import nail from "../poses/nail.json";
import star from "../poses/star.json";
import balanceRight from "../poses/BalanceRight.json";
import inclineLeft from "../poses/InclineLeft.json";
import inclineRight from "../poses/InclineRight.json";
import doubleHandPose from "../poses/DoubleHandPose.json";
import oPose from "../poses/OPose.json";
import wPose from "../poses/wpose.json";
import rightLegRaise from "../poses/rightlegraise.json";
import crabImage from "../poses/crab.png";
import nailImage from "../poses/nailpose.png";
import starImage from "../poses/starPose.png";
import inclineLeftImage from "../poses/InclineLeft.png";
import inclineRightImage from "../poses/InclineRight.png";
import balanceRightImage from "../poses/BalanceRight.png";
import doubleHandPoseImage from "../poses/DoubleHandPose.png";
import oPoseImage from "../poses/oPose.png";
import wPoseImage from "../poses/wPose.png";
import rightLegRaiseImage from "../poses/rightlegraise.png";

export const gameConfig = {
  easy: {
    difficulty: 0,
    timer: 5,
    threshold: 5,
    poses: [crab, nail, rightLegRaise],
    images: [crabImage, nailImage, rightLegRaiseImage],
  },
  medium: {
    difficulty: 1,
    timer: 4,
    threshold: 4,
    poses: [star, inclineLeft, inclineRight],
    images: [starImage, inclineLeftImage, inclineRightImage],
  },
  hard: {
    difficulty: 2,
    timer: 3,
    threshold: 3,
    poses: [balanceRight, doubleHandPose, oPose, wPose],
    images: [balanceRightImage, doubleHandPoseImage, oPoseImage, wPoseImage],
  },
};
