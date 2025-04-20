// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";
import axios from "axios";

const CategoryPage = () => {
  const { id } = useParams();  // Get the category ID from the URL
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from the backend based on category ID
        const response = await axios.get(`/api/products?category=${id}`);
        setProducts(response.data.products);  // Assuming the backend returns products in this format
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [id]);  // Re-run when category ID changes

  return (
    <Container>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mt={4}>
        Products in {id} Category
      </Typography>
      <Grid container spacing={2} justifyContent="center" mt={2}>
        {products.length > 0 ? (
          products.map((product) => (
            <Grid item key={product.id}>
              <Card sx={{ width: 250, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ${product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary" textAlign="center">
            No products available in this category.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default CategoryPage;
