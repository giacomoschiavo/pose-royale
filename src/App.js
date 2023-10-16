import "./App.css";
import { useState } from "react";
import CanvasLandmarks from "./CanvasLandmarks";

function App() {
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [landmarks, setLandmarks] = useState(null);

  return (
    <div className="App">
      <CanvasLandmarks
        setLandmarks={setLandmarks}
        poseLandmarker={poseLandmarker}
        setPoseLandmarker={setPoseLandmarker}
      />

      <div className="landmarks">
        {landmarks &&
          landmarks.map((item, index) => (
            <div className="coordinates">
              <p key={index}>
                Index: {item.index}, x: {item.x.toFixed(3)}, y:
                {item.y.toFixed(3)}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
