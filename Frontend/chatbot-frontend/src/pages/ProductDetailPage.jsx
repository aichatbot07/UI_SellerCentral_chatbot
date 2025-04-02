import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Card, CardContent, Grid, CircularProgress } from "@mui/material";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data); // Assuming the backend returns a product object
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Typography variant="h6" color="error">Sorry, the product details could not be fetched.</Typography>
      </Container>
    );
  }

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
