import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, Box } from "@mui/material";
import CategoryCard from "../components/CategoryCard";
import Chatbot from "../components/Chatbot";
import axios from "axios"; // Import axios for making API calls

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch data from the backend products endpoint
        const response = await axios.get("http://localhost:8000/products");
        setProducts(response.data.products); // Store the products in state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mt={4}>
        Welcome to Our Marketplace
      </Typography>
      <Typography variant="body1" textAlign="center" color="gray" mb={4}>
        Explore various categories and get insights from our chatbot!
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {products.map((product) => (
          <Grid item key={product.id}>
            <Card
              sx={{
                width: 250,
                boxShadow: 3,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
              onClick={() => window.location.href = `/product/${product.id}`}
            >
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="textSecondary">{product.category}</Typography>
                <Typography variant="body1" color="primary">{`$${product.price}`}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Chatbot />
    </Container>
  );
};

export default LandingPage;
