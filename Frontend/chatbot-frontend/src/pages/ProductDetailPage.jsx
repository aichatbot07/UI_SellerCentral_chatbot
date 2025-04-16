import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Chatbot from "../components/Chatbot";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Divider,
  Rating,
  Alert,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const API_BASE_URL = "https://fastapi-app-1061880689774.us-central1.run.app";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        setError("Product ID is missing");
        setLoading(false);
        return;
      }

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
      const formattedStr = str
        .replace(/'/g, '"')
        .replace(/\bNone\b/g, "null");
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

  const parsedImages = parseJsonSafe(product.image_url);
  const parsedDescription = parseJsonSafe(product.description);

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        {/* Image Carousel */}
        <Grid item xs={12} md={6}>
        <Carousel
  showThumbs={false}
  infiniteLoop
  useKeyboardArrows
  autoPlay
  dynamicHeight={false}
  showStatus={false}
>
  {parsedImages && parsedImages.length > 0 ? (
    parsedImages.map((img, index) => (
      <div key={index}>
        <img
          src={img.large || "https://via.placeholder.com/400"}
          alt={`Product image ${index + 1}`}
          style={{
            borderRadius: "12px",
            objectFit: "contain",
            maxWidth: "100%",
            maxHeight: "400px",
            width: "100%",
            height: "400px",
            margin: "0 auto",
          }}
        />
      </div>
    ))
  ) : (
    <div>
      <img
        src="https://via.placeholder.com/400"
        alt="Default product"
        style={{
          borderRadius: "12px",
          objectFit: "contain",
          maxWidth: "100%",
          maxHeight: "400px",
          width: "100%",
          height: "400px",
          margin: "0 auto",
        }}
      />
    </div>
  )}
</Carousel>

        </Grid>

        {/* Product Info */}
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
            ${product.price ? product.price.toFixed(2) : "0.00"}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" color="textSecondary" paragraph>
            {Array.isArray(parsedDescription)
              ? parsedDescription.join(", ")
              : product.description || "No description available for this product."}
          </Typography>
        </Grid>
      </Grid>

      <Chatbot />
    </Container>
  );
};

export default ProductDetailPage;
