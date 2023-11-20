import React, { useState, useEffect, useCallback, useRef } from "react";
import Canvas from "./Canvas";
import {
  initPoseLandmarker,
  filterLandmarks,
  drawCircles,
  detectPose,
  drawSquares,
} from "./detection";
import { GameController } from "./utils/GameController";
import styles from "./GameManager.module.css";

const GameManager = () => {
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [landmarks, setLandmarks] = useState(null);
  const [gameController, setGameController] = useState(null);
  // const [games, setGames] = useState([]);
  // const [difficulty, setDifficulty] = useState(0);
  // const [timer, setTimer] = useState(0);
  // const [poses, setPoses] = useState([]);
  // const [images, setImages] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [detect, setDetect] = useState(false);
  const [seconds, setSeconds] = useState(10);
  // const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);
  const squareSide = 0.08;
  const [checked, setChecked] = useState(false);

  const imgRef = useRef(null);
  // const [gameController, setGameController] = useState(null);
  // useEffect(() => {
  //   const gameController = new GameController();
  //   gameController.init();
  //   setGameController(gameController);
  // }, [setGameController]);

  useEffect(() => {
    let gc = new GameController();
    gc.init();
    setGameController(gc);
  }, []);

  // The timer
  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        prevSeconds -= 1;
        if (prevSeconds < 0) {
          setChecked(false);
          prevSeconds = 10;
        }
        return prevSeconds;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]); // Aggiungi loading come dipendenza

  useEffect(() => {
    if (seconds === 0 && !checked) {
      setChecked(true);
      // detect if the pose is correct
      const passed = detectPose(
        gameController.getCurrentPose(),
        landmarks,
        squareSide
      );
      if (passed) setScore((prev) => prev + 1);
      gameController.nextPose();
    }
  }, [seconds, landmarks, gameController, checked]);

  // const getCoordinates = () => {
  //   console.log(landmarks);
  // };

  const gameDraw = useCallback(
    (canvasElement, canvasCtx, video) => {
      let lastVideoTime = -1;
      let startTimeMs = performance.now();

      // this is triggered when "Load Skeleton" is clicked
      if (poseLandmarker && !loading) {
        // console.log(gameController);
        gameController.start(() => setStarted(true));
        imgRef.current.src = gameController.getCurrentImage();

        // draw matrix on screen (only for posing)
        canvasCtx.save();
        // clear the canvas at each iteration
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        if (video.currentTime !== lastVideoTime) {
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
          });
        }
      }
    },
    [poseLandmarker, loading, gameController]
  );

  const gameUpdate = useCallback(() => {
    // console.log("update state");
  }, []);

  const handleDetection = () => {
    // gameController.nextPose();
    setScore((prev) => prev + 1);
  };

  useEffect(() => {
    initPoseLandmarker((poseLandmarker) => {
      setPoseLandmarker(poseLandmarker);
    });
  }, [setPoseLandmarker]);

  return (
    <>
      <div className={styles.gameContainer}>
        <Canvas gameUpdate={gameUpdate} gameDraw={gameDraw} />
        <img
          ref={imgRef}
          className={`${loading ? "" : styles.zoomIn} ${
            loading ? "" : styles.backgroundImg
          }`}
          alt="background_pose"
        />
      </div>
      <p>Timer: {seconds}</p>
      <div>
        {loading && (
          <button className={{}} onClick={() => setLoading(false)}>
            Start
          </button>
        )}
        <button onClick={handleDetection}>Force Detection</button>
      </div>
      {/* <div className="landmarks">
        <button onClick={getCoordinates}>Get Coordinates</button>
        {landmarks &&
          Object.keys(landmarks).map((key) => (
            <ul className="coordinates">
              <li key={key}>
                Index: {key}, x: {landmarks[key].x.toFixed(3)}, y:
                {landmarks[key].y.toFixed(3)}
              </li>
            </ul>
          ))}
      </div> */}
    </>
  );
};

export { GameManager };
