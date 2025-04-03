import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Divider,
  Rating,
  Button,
  Alert,
} from "@mui/material";

const API_BASE_URL = "http://localhost:8000"; // Centralized API URL

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

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

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Product not found.
        </Typography>
      </Container>
    );
  }

  // Parse image URLs and description safely
  const imageUrl = product.image_url
    ? parseJsonSafe(product.image_url)?.[0]?.large || "https://via.placeholder.com/400"
    : "https://via.placeholder.com/400";

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        {/* Image Section */}
        <Grid item xs={12} md={6}>
          <img
            src={imageUrl}
            alt={product.name}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </Grid>

        {/* Product Information Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Rating value={product.average_rating || 0} readOnly />
            <Typography variant="body2" color="textSecondary">
              ({product.rating_number ?? 0} reviews)
            </Typography>
          </Box>
          <Typography variant="h5" color="primary" gutterBottom>
            ${product.price ? product.price.toFixed(2) : "N/A"}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" color="textSecondary" paragraph>
            {product.description ? parseJsonSafe(product.description).join(", ") : "No description available for this product."}
          </Typography>
          
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;
