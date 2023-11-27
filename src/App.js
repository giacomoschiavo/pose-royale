import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import GameManager from "./GameManager";
import HomePage from "./HomePage";

function App() {
  return (
    <Router>
      <div>
        {/* Tutte le pagine */}
        <p className="">Questa è presente in tutte le pagine</p>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<GameManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
