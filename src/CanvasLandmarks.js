import React, { useEffect, useRef, useState } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import Webcam from "react-webcam";
import { buildSquares } from "./detection";
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
    const drawingUtils = new DrawingUtils(canvasCtx);
    const idPoses = [0, 11, 12, 13, 14, 19, 20, 23, 24, 25, 26, 27, 28];

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

            let newLandmarks = {};
            for (const landmark of result.landmarks) {
              // create new filtered landmarks
              for (let i = 0; i < landmark.length; i++) {
                if (idPoses.includes(i)) {
                  newLandmarks[i] = {
                    x: landmark[i].x,
                    y: landmark[i].y,
                  };
                }
              }
              // drawingUtils.drawConnectors(
              //   landmark,
              //   PoseLandmarker.POSE_CONNECTIONS
              // );
              // drawingUtils.drawLandmarks(newLandmarks, {
              //   color: "red",
              //   fillColor: "red",
              //   radius: 3,
              // });

              const squares = buildSquares(newLandmarks);
              // console.log(squares);
              for (let i = 0; i < squares.length; i++) {
                let square = squares[i];
                canvasCtx.beginPath();
                canvasCtx.lineWidth = "1";
                canvasCtx.rect(
                  square.x * canvasElement.width,
                  square.y * canvasElement.height,
                  square.side * canvasElement.width,
                  square.side * canvasElement.height
                );
                canvasCtx.strokeStyle = "red";
                canvasCtx.stroke();
              }
            }

            // draw rect of tpose
            const squareSide = 0.08;
            for (const [key, value] of Object.entries(tpose)) {
              canvasCtx.beginPath();
              canvasCtx.lineWidth = "1";

              canvasCtx.rect(
                value.x * canvasElement.width,
                value.y * canvasElement.height,
                squareSide * canvasElement.width,
                squareSide * canvasElement.height
              );
              canvasCtx.strokeStyle = "blue";
              canvasCtx.stroke();
            }

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
    async function initPoseLandmarker() {
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
      setPoseLandmarker(poseLandmarker);
    }

    initPoseLandmarker();
  }, []);

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
