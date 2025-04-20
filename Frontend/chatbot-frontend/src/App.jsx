import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import ProductDetailPage from "./pages/ProductDetailPage";  // Import the ProductDetailPage component
import ProductListPage from "./pages/ProductListPage";
import CategoryProducts from "./components/CategoryProducts";
import Header from "./components/Header";  // Import the header component

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Show LoginPage on the root route */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Show the Header and LandingPage on /home */}
        <Route
          path="/home"
          element={
            <>
              <Header />
              <LandingPage />
            </>
          }
        />
        
        {/* Show the Header and CategoryProducts on /products/category/:category */}
        <Route
          path="/products/category/:category"
          element={
            <>
              <Header />
              <CategoryProducts />
            </>
          }
        />
        
        {/* Show ProductDetailPage for a specific product */}
        <Route
          path="/product/:productId"  // Match the product ID in the URL
          element={
            <>
              <Header />
              <ProductDetailPage />  {/* Show the ProductDetailPage component */}
            </>
          }
        />

        {/* If needed, you can add more routes here */}
      </Routes>
    </Router>
  );
};

export default App;
