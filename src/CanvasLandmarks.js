import React, { useEffect, useRef, useState } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import Webcam from "react-webcam";

const CanvasLandmarks = ({ poseLandmarker, setPoseLandmarker }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // draw video on canvas
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasRef.current.getContext("2d");
    const drawingUtils = new DrawingUtils(canvasCtx);

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
            for (const landmark of result.landmarks) {
              drawingUtils.drawLandmarks(landmark, {
                radius: (data) =>
                  DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
              });
              drawingUtils.drawConnectors(
                landmark,
                PoseLandmarker.POSE_CONNECTIONS
              );
            }
            canvasCtx.restore();
          });
        }
      }
      requestAnimationFrame(draw);
    };

    draw();
  }, [poseLandmarker, loading]);

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
      console.log("loaded");
    }

    initPoseLandmarker();
  }, []);

  return (
    <>
      <div>
        <Webcam ref={webcamRef} />
        <canvas ref={canvasRef} />
      </div>
      <button onClick={() => setLoading(false)}>Load Skeleton</button>
    </>
  );
};

export default CanvasLandmarks;
