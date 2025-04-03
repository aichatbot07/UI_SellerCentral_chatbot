import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
  "All_Beauty",
  "Musical_Instruments",
  "Health_and_Personal_Care",
  "Appliances",
  "Amazon_Fashion",
];

const LandingPage = () => {
  const navigate = useNavigate();

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
          <Grid item key={category}>
            <Card
              sx={{
                width: 200,
                boxShadow: 3,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": { boxShadow: 6 },
              }}
              onClick={() => navigate(`/products/category/${category}`)}
            >
              <CardContent>
                <Typography variant="h6" textAlign="center">
                  {category.replace(/_/g, " ")}
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
