import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  filterLandmarks,
  initPoseLandmarker,
  drawSquares,
  detectPose,
  drawCircles,
  drawMovingImage,
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
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        // Quando il timer raggiunge 0, reimposta il timer a 10 secondi
        if (prevSeconds === 0) {
          clearInterval(timer); // Pulisci il timer corrente
          return 10; // Riavvia il timer
        }
        return prevSeconds - 1;
      });
    }, 1000);

    // Pulisci il timer quando il componente viene smontato
    return () => clearInterval(timer);
  }, [loading]); // Aggiungi loading come dipendenza

  useEffect(() => {
    if (seconds === 0) {
      // Azioni da eseguire quando il timer raggiunge 0
      console.log("Timer scaduto!");
    }
  }, [seconds]);

  const handleDetection = () => {
    gameController.nextPose();
    setScore((prev) => prev + 1);
  };

  useEffect(() => {
    // draw video on canvas
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasRef.current.getContext("2d");

    const draw = () => {
      if (webcamRef.current === null || gameController == null) return;
      const video = webcamRef.current.video;
      canvasElement.width = video.videoWidth;
      canvasElement.height = video.videoHeight;

      let lastVideoTime = -1;
      let startTimeMs = performance.now();
      const backgroundImage = new Image();

      // this is triggered when "Load Skeleton" is clicked
      if (poseLandmarker && !loading) {
        // console.log(gameController);
        gameController.start();
        backgroundImage.src = gameController.getCurrentImage();
        if (video.currentTime !== lastVideoTime) {
          canvasCtx.save();
          // clear the canvas at each iteration
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

          // load background image pose
          drawMovingImage(canvasElement, canvasCtx, backgroundImage, seconds);

          // draw matrix on screen (only for posing)
          // drawGuidelines(canvasElement, canvasCtx);

          // detect poses
          poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
            // // pick only chosen ids
            const squareSide = 0.08;
            const idPoses = [0, 11, 12, 13, 14, 19, 20, 23, 24, 25, 26, 27, 28];
            const skeleton = filterLandmarks(result.landmarks, idPoses);
            setLandmarks(skeleton);

            // const squares = buildSquares(newLandmarks, squareSide);

            // draw squares of the skeleton
            drawCircles(
              canvasElement,
              canvasCtx,
              skeleton,
              squareSide / 2,
              "red"
            );

            // draw squares of the pose (tpose)
            drawSquares(
              canvasElement,
              canvasCtx,
              gameController.getCurrentPose(),
              squareSide,
              "blue"
            );
            canvasCtx.restore();

            // detect if the pose is correct
            const passed = detectPose(
              gameController.getCurrentPose(),
              skeleton,
              squareSide
            );
            setDetect(passed);
          });
        }
      }
      requestAnimationFrame(draw);
    };

    draw();
  }, [
    poseLandmarker,
    loading,
    setLandmarks,
    gameController,
    detect,
    setDetect,
    seconds,
  ]);

  useEffect(() => {
    initPoseLandmarker((poseLandmarker) => {
      setPoseLandmarker(poseLandmarker);
    });
  }, [setPoseLandmarker]);

  return (
    <>
      <div className="test-description">
        <p>Model loaded? {loading ? <span>No</span> : <span>Yes</span>}</p>
        <p>Detected pose: {detect ? <span>Yes</span> : <span>No</span>}</p>
      </div>
      <div
        className="container"
        style={detect ? { borderColor: "green" } : { borderColor: "red" }}
      >
        <Webcam ref={webcamRef} />
        <canvas ref={canvasRef} />
        <p className="score-label">
          Score: {score}, Timer: {seconds}
        </p>
      </div>
      <div>
        {loading && (
          <button className={{}} onClick={() => setLoading(false)}>
            Load model
          </button>
        )}

        <button onClick={handleDetection}>Force Detection</button>
      </div>
    </>
  );
};

export default CanvasLandmarks;
