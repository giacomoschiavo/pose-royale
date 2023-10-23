import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  buildSquares,
  drawGuidelines,
  filterLandmarks,
  initPoseLandmarker,
  drawSquares,
  detectPoses,
  detectPose2,
} from "./detection";
import tpose from "./poses/tpose.json";
import imageTpose from "./poses/TPose.png";

const CanvasLandmarks = ({
  poseLandmarker,
  setPoseLandmarker,
  setLandmarks,
  gameController,
}) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [detect, setDetect] = useState(false);

  useEffect(() => {
    // draw video on canvas
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasRef.current.getContext("2d");

    const draw = () => {
      if (webcamRef.current === null) return;
      const video = webcamRef.current.video;
      canvasElement.width = video.videoWidth;
      canvasElement.height = video.videoHeight;

      let lastVideoTime = -1;
      let startTimeMs = performance.now();
      // this is triggered when "Load Skeleton" is clicked
      if (poseLandmarker && !loading) {
        if (video.currentTime !== lastVideoTime) {
          canvasCtx.save();
          // clear the canvas at each iteration
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

          // load background image pose
          const img = new Image();
          img.src = imageTpose;
          canvasCtx.globalAlpha = 0.4;
          canvasCtx.drawImage(
            img,
            0,
            0,
            canvasElement.width,
            canvasElement.height
          );
          canvasCtx.globalAlpha = 1;

          // draw matrix on screen
          // drawGuidelines(canvasElement, canvasCtx);
          gameController.update();
          gameController.draw(canvasElement, canvasCtx);

          // detect poses
          poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
            // // pick only chosen ids
            const squareSide = 0.08;
            const idPoses = [0, 11, 12, 13, 14, 19, 20, 23, 24, 25, 26, 27, 28];
            const skeleton = filterLandmarks(result.landmarks, idPoses);
            setLandmarks(skeleton);

            // const squares = buildSquares(newLandmarks, squareSide);
            // draw squares of the skeleton
            // drawSquares(canvasElement, canvasCtx, skeleton, squareSide, "red");

            // // draw squares of the pose (tpose)
            // drawSquares(canvasElement, canvasCtx, tpose, squareSide, "blue");

            canvasCtx.restore();
            const passed = detectPose2(tpose, skeleton, squareSide);
            setDetect(passed);
          });
        }
      }
      requestAnimationFrame(draw);
    };

    draw();
  }, [poseLandmarker, loading, setLandmarks]);

  useEffect(() => {
    initPoseLandmarker((poseLandmarker) => {
      setPoseLandmarker(poseLandmarker);
    });
  }, [setPoseLandmarker]);

  return (
    <div className="container">
      <div className="container-video">
        <Webcam ref={webcamRef} />
        <canvas ref={canvasRef} />
      </div>
      <button onClick={() => setLoading(false)}>Load Skeleton</button>
      <h1 className="detect">{detect ? "True" : "False"}</h1>
    </div>
  );
};

export default CanvasLandmarks;
