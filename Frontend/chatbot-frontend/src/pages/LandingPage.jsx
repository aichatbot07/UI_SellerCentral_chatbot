import React from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Define categories and their respective endpoints for API requests
const categories = [
  { name: "All Beauty", endpoint: "All Beauty" },
  { name: "Amazon Fashion", endpoint: "Amazon Fashion" },
  { name: "Appliances", endpoint: "Appliances" },
  { name: "Health & Personal Care", endpoint: "Health & Personal Care" },
  { name: "Musical Instruments", endpoint: "Musical Instruments" }, // Corrected category here
];

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    const seller = JSON.parse(localStorage.getItem("seller")); // Get seller data from localStorage

    if (!seller || !seller.id) {
      alert("Seller ID is missing. Please log in again.");
      return;
    }

    const sellerId = seller.id; // Retrieve the sellerId
    // Construct the correct API URL based on category endpoint
    const apiUrl = `https://fastapi-app-1061880689774.us-central1.run.app/products/filter?seller_id=${sellerId}&main_category=${category.endpoint}`;

    // Navigate to products page and pass the API URL
    navigate(`/products/category/${category.endpoint}`, { state: { apiUrl } });
  };

  return (
    <Container>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mt={4}>
        Welcome to Our Marketplace
      </Typography>
      <Typography variant="body1" textAlign="center" color="gray" mb={4}>
        Explore various categories and get insights from our chatbot!
      </Typography>

      {/* Category Cards */}
      <Grid container spacing={2} justifyContent="center">
        {categories.map((category) => (
          <Grid item key={category.endpoint}>
            <Card
              sx={{
                width: 200,
                boxShadow: 3,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": { boxShadow: 6 },
              }}
              onClick={() => handleCategoryClick(category)} // On card click, call handleCategoryClick
            >
              <CardContent>
                <Typography variant="h6" textAlign="center">
                  {category.name} {/* Display the category name */}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LandingPage;
