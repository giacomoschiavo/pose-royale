import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  filterLandmarks,
  initPoseLandmarker,
  drawSquares,
  detectPose,
  drawCircles,
  drawGuidelines,
} from "./detection";
import styles from "./CanvasLandmarks.module.css";
import tposeImage from "./poses/TPose.png";

const CanvasLandmarks = ({
  poseLandmarker,
  setPoseLandmarker,
  setLandmarks,
  gameController,
}) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [detect, setDetect] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [poseImage, setPoseImage] = useState("");
  const [toCheck, setToCheck] = useState(false);
  const [isGameInitialized, setIsGameInitialized] = useState(false);
  const [animClasses, setAnimClasses] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;
    const timer = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          setToCheck(true);
          prevTimer = duration + 1;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, duration]);

  const handleDetection = () => {};

  useEffect(() => {
    if (!toCheck) return;
    setToCheck(false);
    gameController.nextPose();
    setDuration(gameController.getDurationTimer());
    setPoseImage(gameController.getCurrentImage());
    setTimer(gameController.getDurationTimer() + 1);
    setAnimClasses(false);
    imgRef.current.src = gameController.getCurrentImage();
    setScore((prev) => prev + 1);
  }, [toCheck, gameController]);

  useEffect(() => {
    if (poseLandmarker && !loading) {
      setGameStarted(true);
    }
  }, [poseLandmarker, loading]);

  useEffect(() => {
    if (gameStarted && !isGameInitialized) {
      // console.log(gameController);
      gameController.start();
      setDuration(gameController.getDurationTimer());
      setPoseImage(gameController.getCurrentImage());
      setTimer(gameController.getDurationTimer());
      imgRef.current.src = gameController.getCurrentImage();
      setAnimClasses(true);
      setIsGameInitialized(true);
    }
  }, [gameStarted, gameController, isGameInitialized]);

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

      if (gameStarted && isGameInitialized) {
        // draw matrix on screen (only for posing)
        canvasCtx.save();
        // clear the canvas at each iteration
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        if (video.currentTime !== lastVideoTime) {
          drawGuidelines(canvasElement, canvasCtx);

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
            // drawSquares(
            //   canvasElement,
            //   canvasCtx,
            //   gameController.getCurrentPose(),
            //   squareSide,
            //   "blue"
            // );
            // canvasCtx.restore();

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
    gameStarted,
    detect,
    setDetect,
    setDuration,
    setPoseImage,
    timer,
    isGameInitialized,
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
        <img
          ref={imgRef}
          className={`${gameStarted && styles.poseImage} ${
            gameStarted && styles.zoomIn
          }`}
          src={poseImage}
        />
        <p className={styles.scoreLabel}>
          Score: {score}, Timer: {timer}
        </p>
      </div>
      <div>
        {loading && (
          <button className={{}} onClick={() => setLoading(false)}>
            Start
          </button>
        )}

        <button onClick={handleDetection}>Force Detection</button>
      </div>
    </>
  );
};

export default CanvasLandmarks;
