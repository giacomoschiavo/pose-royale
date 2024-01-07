import React, { useState, useEffect, useCallback, useRef } from "react";
import CanvasVideo from "./CanvasVideo";
import {
  initPoseLandmarker,
  filterLandmarks,
  drawCircles,
  detectPose,
  drawSquares,
} from "./utils/utils";
import { GameController } from "./utils/GameController";
import styles from "./GameManager.module.css";
import BorderedButton from "./components/BorderedButton";

const GameManager = () => {
  // save the instance of the game controller
  const [gameController, setGameController] = useState(null);
  // helps getting the landmarks
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  // score of the game
  const [score, setScore] = useState(0);
  // loading state
  const [loading, setLoading] = useState(true);
  // is pose correct? only when timer finishes
  const [toCheck, setToCheck] = useState(false);
  // game has started
  const [started, setStarted] = useState(false);
  // emoji checker, if the pose is correct
  const [passed, setPassed] = useState(false);
  // if the game is ended (shows game over screen)
  const [ended, setEnded] = useState(false);
  // if the game is in tutorial
  const [inTutorial, setInTutorial] = useState(true);
  // countdown before the game starts, after the tutorial
  const startingCountdown = 5;
  // seconds of the shown timer
  const [seconds, setSeconds] = useState(startingCountdown);
  // save instance of the current setInterval (to clear it later)
  const [timer, setTimer] = useState(null);
  // seconds to perform the pose (based on difficulty)
  const [timerPose, setTimerPose] = useState(0);
  // if the initial countdown has started (once the tutorial is finished)
  const [startInitialCountdown, setStartInitialCountdown] = useState(false);

  const [level, setLevel] = useState(0); // [0 = tutorial, 1 = easy, 2 = medium, 3 = hard]
  // the current landmarks
  const [landmarks, setLandmarks] = useState(null);

  // save accuracy of the current pose
  const [accuracy, setAccuracy] = useState(0);
  const [accuracies, setAccuracies] = useState([]);

  // number of points to detect
  const numPoints = 13;
  // size of the square (error )
  const squareSide = 0.1;
  // reference to the pose image
  const imgRef = useRef(null);

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

  useEffect(() => {
    if (startInitialCountdown) {
      const timer = setInterval(() => {
        // run this every second
        setSeconds((prevSeconds) => {
          prevSeconds -= 1;
          return prevSeconds;
        });
      }, 1000);

      // run this after the countdown
      setTimeout(() => {
        setInTutorial(false);
        setStartInitialCountdown(false);
        gameController.start();
        setStarted(true);
        setLevel(gameController.getDifficulty() + 1);
        setSeconds(gameController.getGameTimer());
        setTimerPose(gameController.getGameTimer());
        clearInterval(timer);
      }, startingCountdown * 1000);
    }
  }, [startInitialCountdown, gameController]);

  // The timer, avoid starting it if the game is loading or in tutorial
  useEffect(() => {
    if (loading || inTutorial) return;
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        prevSeconds -= 1;
        // time is over
        if (prevSeconds < 0) {
          // time to check if the pose is correct
          setToCheck(true);
          // set new timer
          prevSeconds = timerPose;
        }
        return prevSeconds;
      });
    }, 1000);
    // set timer state so that we can clear it later
    setTimer(timer);

    // clean up function
    return () => clearInterval(timer);
  }, [loading, timerPose, inTutorial]); // Aggiungi loading come dipendenza

  useEffect(() => {
    if (!gameController || !landmarks) return;

    // detect if the pose is correct
    let detected = detectPose(
      gameController.getCurrentPose(),
      landmarks,
      squareSide
    );

    const currentAccuracy = (detected / numPoints) * 100;
    setAccuracy(currentAccuracy);
    detected = detected >= numPoints;

    setPassed(detected);

    if (inTutorial && detected) setStartInitialCountdown(true);

    // if the pose is correct, increment the score
    if (toCheck && !inTutorial) {
      setToCheck(false);
      const currentAccuracies = [...accuracies, currentAccuracy];
      setAccuracies(currentAccuracies);
      // increase of one point, not in tutorial
      if (detected) setScore((prev) => prev + 1);
      // get next pose
      gameController.nextPose();
      // if the game is ended, set the state
      if (gameController.isGameEnded()) {
        setEnded(true);
        const summed = currentAccuracies.reduce((a, b) => a + b, 0);
        console.log(summed / currentAccuracies.length);
      } else {
        // set level
        setLevel(gameController.getDifficulty() + 1);
        // set new time based on difficulty of the game
        setTimerPose(gameController.getGameTimer());
        // set timer
        setSeconds(gameController.getGameTimer());
      }
    }
  }, [
    seconds,
    landmarks,
    gameController,
    toCheck,
    inTutorial,
    passed,
    accuracies,
    accuracy,
  ]);

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
        if (imgRef.current)
          imgRef.current.src = gameController.getCurrentImage();

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        if (video.currentTime !== lastVideoTime) {
          // drawGuidelines(canvasElement, canvasCtx);

          // detect poses
          poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
            // // pick only chosen ids
            const idPoses = [0, 11, 12, 13, 14, 19, 20, 23, 24, 25, 26, 27, 28];

            const skeleton = filterLandmarks(result.landmarks, idPoses);
            setLandmarks(skeleton);
            // const squares = buildSquares(newLandmarks, squareSide);

            // draw squares of the skeleton
            // drawCircles(
            //   canvasElement,
            //   canvasCtx,
            //   skeleton,
            //   squareSide / 2,
            //   "red"
            // );

            // draw squares of the pose (tpose)
            // drawSquares(
            //   canvasElement,
            //   canvasCtx,
            //   gameController.getCurrentPose(),
            //   squareSide,
            //   "black"
            // );
            canvasCtx.restore();
          });
        }
      }
    },
    [poseLandmarker, loading, gameController]
  );

  const shouldAnimate = seconds > 0 && started && !ended && !inTutorial;
  const showImage = started && !ended;
  const showLevelText =
    level === 0
      ? "Tutorial"
      : level === 1
      ? "Easy"
      : level === 2
      ? "Medium"
      : "Hard";
  const levelColor =
    level === 0
      ? "grey"
      : level === 1
      ? "green"
      : level === 2
      ? "yellow"
      : "red";

  const showTutorialText = started && inTutorial && !startInitialCountdown;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.gameContainer}>
        <div className={styles.canvasContainer}>
          <CanvasVideo gameDraw={gameDraw} />
          {loading && (
            <BorderedButton
              customStyle={`${styles.centeredbottom} ${styles.startButton}`}
              onClick={() => {
                setLoading(false);
                setStarted(true);
              }}
            >
              Start
            </BorderedButton>
          )}
          {showImage && (
            <img
              ref={imgRef}
              className={`${shouldAnimate ? styles.zoomIn : ""} ${
                styles.backgroundImg
              }`}
              style={{
                animationDuration: `${started ? timerPose : 0}s`,
                display: `${startInitialCountdown ? "none" : "block"}`,
                borderColor: `${levelColor}`,
              }}
              alt="background_pose"
            />
          )}

          {showTutorialText && (
            <div className={styles.hudTutorial}>
              <p className={styles.top}>TUTORIAL</p>
              <p className={styles.bottom}>
                Perform this pose to start the game!
              </p>
              {/* <button
                onClick={() => setStartInitialCountdown(true)}
                className={styles.centered}
                style={{ opacity: 0.8 }}
              >
                Skip tutorial
              </button> */}
            </div>
          )}
          {ended && (
            <div className={styles.gameoverScreen}>
              <h1>Game Over</h1>
            </div>
          )}

          {/* Show initial countdown */}
          {started && (
            <div className={styles.hudContainer}>
              {!inTutorial && !ended && (
                <div className={`${styles.hudTimer} ${styles.upperright}`}>
                  {seconds}
                </div>
              )}
              {!ended && (
                <div className={`${styles.hudLevel} ${styles.bottomright}`}>
                  {showLevelText}
                </div>
              )}
              {seconds === 0 && !ended && !inTutorial && (
                <div className={`${styles.centered}`}>
                  <h1>{!ended ? (passed ? "👍" : "👎") : ""}</h1>
                </div>
              )}

              <div className={`${styles.hudScore} ${styles.bottomleft}`}>
                {score}
                <p>SCORE</p>
              </div>
              <div className={`${styles.hudCheck} ${styles.upperleft}`}>
                {!ended ? (passed ? "😁" : "💀") : "👑"}
              </div>
              {/*<div className={`${styles.hudAccuracy} ${styles.uppercenter}`}>
                {accuracy}
              </div>*/}
            </div>
          )}
        </div>
        {startInitialCountdown && (
          <div className={`${styles.centered} ${styles.initialCountdown}`}>
            {seconds > 0 ? seconds : "GO!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameManager;
