import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  buildSquares,
  drawGuidelines,
  filterLandmarks,
  initPoseLandmarker,
  drawSquares,
} from "./detection";
import tpose from "./poses/tpose.json";

const CanvasLandmarks = ({
  poseLandmarker,
  setPoseLandmarker,
  setLandmarks,
}) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

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
      if (poseLandmarker && !loading) {
        if (video.currentTime !== lastVideoTime) {
          poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
            canvasCtx.save();
            canvasCtx.clearRect(
              0,
              0,
              canvasElement.width,
              canvasElement.height
            );

            drawGuidelines(canvasElement, canvasCtx);

            // pick only chosen ids
            const idPoses = [0, 11, 12, 13, 14, 19, 20, 23, 24, 25, 26, 27, 28];
            let newLandmarks = filterLandmarks(result.landmarks, idPoses);

            const squareSide = 0.08;
            const squares = buildSquares(newLandmarks, squareSide);
            // draw squares of the skeleton
            drawSquares(canvasElement, canvasCtx, squares, squareSide, "red");

            // draw squares of the pose (tpose)
            drawSquares(
              canvasElement,
              canvasCtx,
              Object.values(tpose),
              squareSide,
              "blue"
            );

            canvasCtx.restore();
            setLandmarks(newLandmarks);
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
    </div>
  );
};

export default CanvasLandmarks;
