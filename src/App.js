import "./App.css";
import { useState } from "react";
import CanvasLandmarks from "./CanvasLandmarks";

function App() {
  const [poseLandmarker, setPoseLandmarker] = useState(null);

  return (
    <div className="App">
      <CanvasLandmarks
        poseLandmarker={poseLandmarker}
        setPoseLandmarker={setPoseLandmarker}
      />
    </div>
  );
}

export default App;
