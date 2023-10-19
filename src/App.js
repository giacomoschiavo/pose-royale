import "./App.css";
import { useState } from "react";
import CanvasLandmarks from "./CanvasLandmarks";

function App() {
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [landmarks, setLandmarks] = useState(null);

  const getCoordinates = () => {
    console.log(landmarks);
  };

  return (
    <div className="App">
      <CanvasLandmarks
        setLandmarks={setLandmarks}
        poseLandmarker={poseLandmarker}
        setPoseLandmarker={setPoseLandmarker}
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
