import "./App.css";
import { useEffect, useState } from "react";
import CanvasLandmarks from "./CanvasLandmarks";
import { GameController } from "./utils/GameController";

function App() {
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [landmarks, setLandmarks] = useState(null);
  const [gameController, setGameController] = useState(null);

  useEffect(() => {
    const gameController = new GameController();
    gameController.init();
    setGameController(gameController);
  }, [setGameController]);

  const getCoordinates = () => {
    console.log(landmarks);
  };

  return (
    <div className="App">
      <CanvasLandmarks
        setLandmarks={setLandmarks}
        landmarks={landmarks}
        poseLandmarker={poseLandmarker}
        setPoseLandmarker={setPoseLandmarker}
        gameController={gameController}
      />

      <div className="landmarks">
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
      </div>
    </div>
  );
}

export default App;
