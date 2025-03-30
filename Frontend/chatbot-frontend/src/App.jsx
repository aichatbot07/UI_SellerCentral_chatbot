import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import "./styles/global.css"; // Import global styles

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/category/:id" element={<h1>Category Page (Coming Soon)</h1>} />
      </Routes>
    </Router>
  );
};

export default App;

