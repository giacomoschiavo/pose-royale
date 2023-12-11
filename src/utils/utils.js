import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const buildSquares = (landMarks, squareSide) => {
  const squares = {};
  for (const [key, value] of Object.entries(landMarks)) {
    squares[key] = {
      x: value.x,
      y: value.y,
      side: squareSide,
    };
  }
  return squares;
};

export const detectPoses = (poseLandmarks, actualLandMarks) => {
  let flag = true;
  // console.log(poseLandmarks);
  // console.log(actualLandMarks);
  actualLandMarks.forEach((landMark) => {
    let square = poseLandmarks.filter((square) => {
      console.log(square[0], landMark.index);
      return square[0] === landMark.index;
    })[1];

    if (
      !(
        Math.abs(square.x - landMark.x) < square.side / 2 &&
        Math.abs(square.y - landMark.y) < square.side / 2
      )
    ) {
      flag = false;
      return;
    }
  });

  return flag;
};

export const detectPose = (poseLandmarks, skeletonLandMarks, squareSide) => {
  if (skeletonLandMarks.length === 0) return false;
  return Object.keys(poseLandmarks).reduce((partialSum, key) => {
    const pose = poseLandmarks[key];
    const actual = skeletonLandMarks[key];
    if (!actual) return partialSum;
    const passed =
      Math.abs(pose.x - actual.x) < squareSide / 2 &&
      Math.abs(pose.y - actual.y) < squareSide / 2;
    if (passed) partialSum++;
    return partialSum;
  }, 0);
};

export const drawSquares = (
  canvasElement,
  canvasCtx,
  squares,
  squareSide,
  color = "black"
) => {
  Object.values(squares).forEach((square) => {
    canvasCtx.beginPath();
    canvasCtx.lineWidth = "2";
    canvasCtx.rect(
      (square.x - squareSide / 2) * canvasElement.width,
      (square.y - squareSide / 2) * canvasElement.height,
      squareSide * canvasElement.width,
      squareSide * canvasElement.height
    );
    canvasCtx.strokeStyle = color;
    canvasCtx.stroke();
  });
};

export const drawCircles = (
  canvasElement,
  canvasCtx,
  squares,
  squareSide,
  color = "red"
) => {
  Object.values(squares).forEach((square) => {
    canvasCtx.beginPath();
    canvasCtx.arc(
      square.x * canvasElement.width,
      square.y * canvasElement.height,
      10,
      0,
      2 * Math.PI
    );
    canvasCtx.fillStyle = color;
    canvasCtx.fill();
    canvasCtx.closePath();
  });
};

export const drawGuidelines = (canvasElement, canvasCtx) => {
  // draw a line in the middle of the canvas
  canvasCtx.beginPath();
  canvasCtx.moveTo(canvasElement.width / 2, 0);
  canvasCtx.lineTo(canvasElement.width / 2, canvasElement.height);
  canvasCtx.strokeStyle = "red";
  canvasCtx.stroke();
  canvasCtx.closePath();
  canvasCtx.beginPath();
  canvasCtx.moveTo(0, canvasElement.height / 2);
  canvasCtx.lineTo(canvasElement.width, canvasElement.height / 2);
  canvasCtx.stroke();
  canvasCtx.closePath();
  canvasCtx.beginPath();
  canvasCtx.moveTo(0, canvasElement.height * 0.9);
  canvasCtx.lineTo(canvasElement.width, canvasElement.height * 0.9);
  canvasCtx.strokeStyle = "red";
  canvasCtx.stroke();
  canvasCtx.closePath();
};

export const filterLandmarks = (landmarks, idPoses) => {
  let newLandmarks = {};
  // da sistemare
  for (const landmark of landmarks) {
    // create new filtered landmarks
    for (let i = 0; i < landmark.length; i++) {
      if (idPoses.includes(i)) {
        newLandmarks[i] = {
          x: landmark[i].x,
          y: landmark[i].y,
        };
      }
    }
  }

  return newLandmarks;
};

export const initPoseLandmarker = async (callback) => {
  const vision = await FilesetResolver.forVisionTasks(
    // path/to/wasm/root
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
  });

  callback(poseLandmarker);
};
