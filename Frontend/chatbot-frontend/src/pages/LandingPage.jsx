import React from "react";
import { Container, Typography, Grid } from "@mui/material";
import CategoryCard from "../components/CategoryCard";
import Chatbot from "../components/Chatbot";

const categories = [
  { category: "beauty", title: "Beauty Products", image: "/assets/beauty.jpg" },
  { category: "shopping", title: "E-Commerce", image: "/assets/shopping.jpg" },
  { category: "fitness", title: "Fitness & Health", image: "/assets/fitness.jpg" },
];

const LandingPage = () => {
  return (
    <Container>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mt={4}>
        Welcome to Our Marketplace
      </Typography>
      <Typography variant="body1" textAlign="center" color="gray" mb={4}>
        Explore various categories and get insights from our chatbot!
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {categories.map((item) => (
          <Grid item key={item.category}>
            <CategoryCard category={item.category} title={item.title} image={item.image} />
          </Grid>
        ))}
      </Grid>

      <Chatbot />
    </Container>
  );
};

export default LandingPage;
