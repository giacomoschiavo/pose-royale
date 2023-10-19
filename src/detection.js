import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const buildSquares = (landMarks, squareSide) => {
  const squares = [];
  for (const [key, value] of Object.entries(landMarks)) {
    squares.push({
      index: key,
      x: value.x,
      y: value.y,
      side: squareSide,
    });
  }
  return squares;
};

export const detectPoses = (squares, actualLandMarks) => {
  actualLandMarks.forEach((landMark) => {
    let square = squares.filter((s) => s.index === landMark.index);
    if (
      !(
        landMark.x > square.x &&
        landMark.x < square.x + square.side &&
        landMark.y > square.y &&
        landMark.y < square.y + square.side
      )
    ) {
      return false;
    }
  });
  return true;
};

export const drawSquares = (
  canvasElement,
  canvasCtx,
  squares,
  squareSide,
  color = "red"
) => {
  for (let i = 0; i < squares.length; i++) {
    let square = squares[i];
    canvasCtx.beginPath();
    canvasCtx.lineWidth = "1";
    canvasCtx.rect(
      (square.x - squareSide / 2) * canvasElement.width,
      (square.y - squareSide / 2) * canvasElement.height,
      squareSide * canvasElement.width,
      squareSide * canvasElement.height
    );
    canvasCtx.strokeStyle = color;
    canvasCtx.stroke();
  }
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
