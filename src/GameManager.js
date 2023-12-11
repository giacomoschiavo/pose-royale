import React, { useState, useEffect, useCallback, useRef } from "react";
import Canvas from "./Canvas";
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
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [landmarks, setLandmarks] = useState(null);
  const [gameController, setGameController] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(1);
  const [started, setStarted] = useState(false);
  const [toCheck, setToCheck] = useState(false); // end game, check poses
  const [currentTimer, setCurrentTimer] = useState(0);
  const [passed, setPassed] = useState(false); // [true = passed, false = failed
  const [ended, setEnded] = useState(false);
  const [timer, setTimer] = useState(null);
  const [inTutorial, setInTutorial] = useState(true);
  const [startInitialCountdown, setStartInitialCountdown] = useState(false);
  const [level, setLevel] = useState(0); // [0 = tutorial, 1 = easy, 2 = medium, 3 = hard]

  const squareSide = 0.1;
  const countdown = 4;
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
    setSeconds(3); // for initial countdown
  }, []);

  useEffect(() => {
    if (startInitialCountdown) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          prevSeconds -= 1;
          return prevSeconds;
        });
      }, 1000);

      setTimeout(() => {
        gameController.start();
        setInTutorial(false);
        setStartInitialCountdown(false);
        setStarted(true);
        setLevel(gameController.getDifficulty() + 1);
        setSeconds(gameController.getGameTimer());
        setCurrentTimer(gameController.getGameTimer());
        clearInterval(timer);
      }, countdown * 1000);
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

    // detect if the pose is correct
    const detected = detectPose(
      gameController.getCurrentPose(),
      landmarks,
      squareSide
    );

    setPassed(detected);

    if (inTutorial && passed) setStartInitialCountdown(true);

    // if the pose is correct, increment the score
    if (toCheck && !inTutorial) {
      setToCheck(false);
      // increase of one point, not in tutorial
      if (passed) setScore((prev) => prev + 1);
      // get next pose
      gameController.nextPose();
      // if the game is ended, set the state
      if (gameController.isGameEnded()) {
        setEnded(true);
      } else {
        // set level
        setLevel(gameController.getDifficulty() + 1);
        // set new time based on difficulty of the game
        setCurrentTimer(gameController.getGameTimer());
        // set timer
        setSeconds(gameController.getGameTimer());
      }
    }
  }, [seconds, landmarks, gameController, toCheck, inTutorial, passed]);

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
              "black"
            );
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

  const showTutorialText = started && inTutorial && !startInitialCountdown;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.gameContainer}>
        <div className={styles.canvasContainer}>
          <Canvas gameDraw={gameDraw} />
          {loading && (
            <BorderedButton
              customStyle={`${styles.centered} ${styles.startButton}`}
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
                animationDuration: `${started ? currentTimer : 0}s`,
                display: `${startInitialCountdown ? "none" : "block"}`,
              }}
              alt="background_pose"
            />
          )}

          {showTutorialText && (
            <div className={styles.hudTutorial}>
              <p className={styles.top}>TUTORIAL</p>
              <p className={styles.bottom}>
                Assume this position to start the game!
              </p>
              <button
                onClick={() => setStartInitialCountdown(true)}
                className={styles.centered}
                style={{ opacity: 0.8 }}
              >
                Skip tutorial
              </button>
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
              {!inTutorial && (
                <div className={`${styles.hudTimer} ${styles.upperright}`}>
                  {seconds}
                </div>
              )}
              <div className={`${styles.hudLevel} ${styles.bottomright}`}>
                {showLevelText}
              </div>
              <div className={`${styles.hudScore} ${styles.bottomleft}`}>
                {score}
                <p>SCORE</p>
              </div>
              <div className={`${styles.hudCheck} ${styles.upperleft}`}>
                {!ended ? (passed ? "😆" : "😐") : "👑"}
              </div>
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
