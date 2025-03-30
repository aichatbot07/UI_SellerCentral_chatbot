// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Card, CardContent, Grid } from "@mui/material";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data); // Assuming the backend returns a product object
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <Container>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mt={4}>
        {product.name}
      </Typography>
      <Grid container spacing={2} justifyContent="center" mt={2}>
        <Grid item>
          <Card sx={{ maxWidth: 400, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Description: {product.description}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Price: ${product.price}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Category: {product.category}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;
