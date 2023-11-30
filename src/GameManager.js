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
import { set } from "lodash";

const GameManager = () => {
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [landmarks, setLandmarks] = useState(null);
  const [gameController, setGameController] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(1);
  const [started, setStarted] = useState(false);
  const [checked, setChecked] = useState(false); // end game, check poses
  const [currentTimer, setCurrentTimer] = useState(0);
  const [ended, setEnded] = useState(false);
  const [timer, setTimer] = useState(null);
  const [inTutorial, setInTutorial] = useState(true);

  const squareSide = 0.08;
  const imgRef = useRef(null);

  const skipTutorial = () => {
    setInTutorial(false);
    gameController.start();
    setSeconds(gameController.getGameTimer());
    setCurrentTimer(gameController.getGameTimer());
  };

  useEffect(() => {
    initPoseLandmarker((poseLandmarker) => {
      setPoseLandmarker(poseLandmarker);
    });
  }, [setPoseLandmarker]);

  useEffect(() => {
    let gc = new GameController();
    gc.init();
    setGameController(gc);
    setInTutorial(gc.isInTutorial());
  }, []);

  // The timer, avoid starting it if the game is loading or in tutorial
  useEffect(() => {
    if (loading || inTutorial) return;
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        prevSeconds -= 1;
        // time is over
        if (prevSeconds < 0) {
          // time to check if the pose is correct
          setChecked(false);
          // set new timer
          prevSeconds = currentTimer;
        }
        return prevSeconds;
      });
    }, 1000);
    // set timer state so that we can clear it later
    setTimer(timer);

    // clean up function
    return () => clearInterval(timer);
  }, [loading, currentTimer, inTutorial]); // Aggiungi loading come dipendenza

  useEffect(() => {
    if (!gameController || !landmarks) return;

    if (inTutorial) {
      const passed = detectPose(
        gameController.getCurrentPose(),
        landmarks,
        squareSide
      );

      if (passed) skipTutorial();
    }

    // if the pose is correct, increment the score
    if (!checked && !inTutorial) {
      setChecked(true);
      // detect if the pose is correct
      const passed = detectPose(
        gameController.getCurrentPose(),
        landmarks,
        squareSide
      );
      // increase of one point, not in tutorial
      if (passed) setScore((prev) => prev + 1);
      // get next pose
      gameController.nextPose();
      // if the game is ended, set the state
      if (gameController.isGameEnded()) {
        setEnded(true);
      } else {
        // set new time based on difficulty of the game
        setCurrentTimer(gameController.getGameTimer());
        // set timer
        setSeconds(gameController.getGameTimer());
      }
    }
  }, [seconds, landmarks, gameController, checked, inTutorial, skipTutorial]);

  // const getCoordinates = () => {
  //   console.log(landmarks);
  // };

  useEffect(() => {
    if (ended) {
      clearInterval(timer);
    }
  }, [ended, timer]);

  const gameDraw = useCallback(
    (canvasElement, canvasCtx, video) => {
      let lastVideoTime = -1;
      let startTimeMs = performance.now();

      // this is triggered when "Start" is clicked
      if (poseLandmarker && !loading) {
        // console.log(gameController);

        // get the current image
        imgRef.current.src = gameController.getCurrentImage();

        canvasCtx.save();
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
    setScore((prev) => prev + 1);
  };

  const shouldAnimate = seconds > 0 && started && !ended && !inTutorial;
  const showImage = started && !ended;

  return (
    <>
      <div className={`${styles.pageContainer}`}>
        <div className={styles.hudContainer}>
          <p className={`${styles.text}`}>Score: {score}</p>
          <p className={`${styles.text}`}>Timer: {seconds}</p>
          <p className={`${styles.text}`}>Level: 1</p>
        </div>

        <div className={styles.gameContainer}>
          <Canvas gameUpdate={gameUpdate} gameDraw={gameDraw} />
          {showImage && (
              <img
                  ref={imgRef}
                  className={`${shouldAnimate ? styles.zoomIn : ""} ${
                      styles.backgroundImg
                  }`}
                  style={{
                    animationDuration: `${started ? currentTimer : 0}s`,
                  }}
                  alt="background_pose"
              />
          )}

          {ended && <p>Game Over</p>}
        </div>
        <div>
          {loading && (
              <button
                  onClick={() => {
                    setLoading(false);
                    setStarted(true);
                  }}
              >
                Start
              </button>
          )}
          {/* <button onClick={handleDetection}>Force Detection</button> */}
        </div>
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

export default GameManager;
