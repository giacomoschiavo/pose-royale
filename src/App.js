import "./App.css";
import { useState } from "react";
import CanvasLandmarks from "./CanvasLandmarks";

function App() {
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [landmarks, setLandmarks] = useState(null);

  const idPoses = [0, 11, 12, 13, 14, 19, 20, 23, 24, 25, 26, 27, 28];

  return (
    <div className="App">
      <CanvasLandmarks
        setLandmarks={setLandmarks}
        poseLandmarker={poseLandmarker}
        setPoseLandmarker={setPoseLandmarker}
      />

      <div className="landmarks">
        {landmarks &&
          landmarks.map(
            (item, index) =>
              idPoses.includes(index) && (
                <div className="coordinates">
                  <p key={index}>
                    Index: {index}, x: {item.x.toFixed(3)}, y:{" "}
                    {item.y.toFixed(3)}
                  </p>
                </div>
              )
          )}
      </div>
    </div>
  );
}

export default App;
