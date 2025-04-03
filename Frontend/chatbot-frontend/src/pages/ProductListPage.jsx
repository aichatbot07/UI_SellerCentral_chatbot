import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Grid, Card, CardContent, Typography, CircularProgress } from "@mui/material";

const ProductListPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve seller ID from local storage
  const seller = JSON.parse(localStorage.getItem("seller"));
  const seller_id = seller?.id ? parseInt(seller.id, 10) : null;

  useEffect(() => {
    if (!seller_id) {
      navigate("/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/products", {
          params: {
            seller_id: Number(seller_id), // Convert to integer
            category: category
          }
        });
        console.log("API Response:", response.data);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error fetching products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    

    fetchProducts();
  }, [category, navigate, seller_id]);

  if (loading) return <Container><CircularProgress /></Container>;
  if (error) return <Container><Typography color="error">{error}</Typography></Container>;
  if (products.length === 0) return <Container><Typography>No products found.</Typography></Container>;

  return (
    <Container>
      <Typography variant="h4" align="center">
        {category.replace(/_/g, " ")} Products
      </Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card onClick={() => navigate(`/product/${product.id}`)}>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography>Price: ${product.price}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductListPage;
