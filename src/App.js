import "./App.css";
import WebcamPoseDetector from "./Canvas";

function App() {
  return (
    <div className="App">
      <head>
        <script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js"
          crossorigin="anonymous"
        ></script>
      </head>
      <WebcamPoseDetector />
    </div>
  );
}

export default App;
