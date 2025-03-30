// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";  // Add this import
import Header from "./components/Header";
import "./styles/global.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />  {/* Add this route */}
      </Routes>
    </Router>
  );
};

export default App;
