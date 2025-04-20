import React from "react";
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; // or BrowserRouter depending on your choice
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductListPage from "./pages/ProductListPage";
import CategoryProducts from "./components/CategoryProducts";
import Header from "./components/Header";

const App = () => {
  return (
    <Router basename="/seller-chatbot-ui">  {/* Add the basename here */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<><Header /><LandingPage /></>} />
        <Route path="/products/category/:category" element={<><Header /><CategoryProducts /></>} />
        <Route path="/product/:productId" element={<><Header /><ProductDetailPage /></>} />
      </Routes>
    </Router>
  );
};

export default App;
