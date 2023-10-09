import React, { useEffect, useRef, useState } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

const WebcamPoseDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const enableWebcamButtonRef = useRef(null);
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const videoHeight = "360px";
  const videoWidth = "480px";
  const runningMode = "IMAGE";

  useEffect(() => {
    const createPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      const poseLandmarkerInstance = await PoseLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: runningMode,
          numPoses: 2,
        }
      );

      setPoseLandmarker(poseLandmarkerInstance);
    };

    createPoseLandmarker();
  }, []);

  const enableCam = async () => {
    if (!poseLandmarker) {
      console.log("Wait! poseLandmaker not loaded yet.");
      return;
    }

    if (webcamRunning) {
      setWebcamRunning(false);
      enableWebcamButtonRef.current.innerText = "ENABLE PREDICTIONS";
    } else {
      setWebcamRunning(true);
      enableWebcamButtonRef.current.innerText = "DISABLE PREDICTIONS";
    }

    const constraints = {
      video: true,
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener("loadeddata", predictWebcam);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  let lastVideoTime = -1;
  const predictWebcam = async () => {
    canvasRef.current.style.height = videoHeight;
    videoRef.current.style.height = videoHeight;
    canvasRef.current.style.width = videoWidth;
    videoRef.current.style.width = videoWidth;

    if (runningMode === "IMAGE") {
      await poseLandmarker.setOptions({ runningMode: "VIDEO" });
    }

    let startTimeMs = performance.now();

    if (lastVideoTime !== videoRef.current.currentTime) {
      lastVideoTime = videoRef.current.currentTime;

      poseLandmarker.detectForVideo(videoRef.current, startTimeMs, (result) => {
        const canvasCtx = canvasRef.current.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        const drawingUtils = new DrawingUtils(canvasCtx);
        for (const landmark of result.landmarks) {
          drawingUtils.drawLandmarks(landmark, {
            radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
          });
          drawingUtils.drawConnectors(
            landmark,
            PoseLandmarker.POSE_CONNECTIONS
          );
        }

        canvasCtx.restore();
      });
    }

    if (webcamRunning) {
      window.requestAnimationFrame(predictWebcam);
    }
  };

  return (
    <div>
      <button onClick={enableCam} ref={enableWebcamButtonRef}>
        ENABLE PREDICTIONS
      </button>
      <video ref={videoRef} id="webcam" autoPlay />
      <canvas ref={canvasRef} id="output_canvas" />
    </div>
  );
};

export default WebcamPoseDetector;
