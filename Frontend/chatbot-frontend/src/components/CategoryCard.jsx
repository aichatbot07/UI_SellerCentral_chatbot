// src/components/CategoryCard.jsx
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";  // Import Link from react-router-dom

const CategoryCard = ({ title, category, image }) => {
  return (
    <Link to={`/category/${category}`} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          width: 250,
          height: 150,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          boxShadow: 3,
          borderRadius: 2,
          p: 2,
        }}
      >
        <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
        <CardContent>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
