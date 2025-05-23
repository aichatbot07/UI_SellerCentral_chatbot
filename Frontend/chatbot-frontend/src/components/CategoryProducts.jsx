import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material"; // MUI components for styling
import Chatbot from "./Chatbot";
const CategoryProducts = () => {
  const { category } = useParams(); // Get the category from the URL
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // For search query input
  const navigate = useNavigate(); // For navigating to product details

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const sellerData = JSON.parse(localStorage.getItem("seller"));
        if (!sellerData) {
          setError("No seller data found. Please log in.");
          setLoading(false);
          return;
        }

        const sellerId = sellerData.id; // Get the seller ID from local storage

        const response = await axios.get(
          `https://fastapi-app-1061880689774.us-central1.run.app/products/filter?seller_id=${sellerId}&main_category=${category}`
        );

        if (response.data.products && response.data.products.length > 0) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products); // Initialize filtered products
        } else {
          setProducts([]); // No products found
        }
        setLoading(false);
      } catch (err) {
        setError("Error fetching products: " + err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Filter products based on the search query
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
      product.description.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredProducts(filtered); // Update the filtered products
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to product detail page with productId
  };
  const parseJsonSafe = (str) => {
    if (!str) return null;
    try {
      // Replace single quotes with double quotes and `None` with `null`
      const formattedStr = str
        .replace(/'/g, '"') // Replace single quotes with double quotes
        .replace(/None/g, 'null'); // Replace None with null
      return JSON.parse(formattedStr);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  };

  const getImage = function(product) {
    const imageUrl = product.image_url
    ? parseJsonSafe(product.image_url)?.[0]?.large || "https://via.placeholder.com/400"
    : "https://via.placeholder.com/400";

    return imageUrl
  }
  

  return (
    <div className="category-products-container">
      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch} // Trigger search on input change
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p>No products available in this category.</p>
      ) : (
        <div>
          <h2>Products in {category} Category</h2>
          {/* MUI Grid for responsive layout */}
          <Grid container spacing={3} justifyContent="center">
            {filteredProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                {/* Link to Product Details */}
                <Card
                  sx={{
                    width: 250,
                    boxShadow: 3,
                    borderRadius: 2,
                    cursor: "pointer",
                    "&:hover": { boxShadow: 6 },
                  }}
                  onClick={() => handleProductClick(product.id)} // Click to navigate to product details
                >
                  {/* Image of the product */}
                  <CardMedia
                    component="img"
                    image={getImage(product)} // Make sure the image URL is correct
                    alt={product.name}
                    sx={{
                      height: 200, // Fixed height for all product images
                      objectFit: "cover", // Ensures the image covers the area without distortion
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" textAlign="center" noWrap>
                      {product.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
