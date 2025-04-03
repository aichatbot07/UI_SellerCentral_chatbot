import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material"; // MUI components for card styling

const ProductList = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const sellerId = localStorage.getItem("seller_id");

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (category && sellerId) {
      axios
        .get(`https://fastapi-app-1061880689774.us-central1.run.app/products/filter`, {
          params: { seller_id: sellerId, main_category: category },
        })
        .then((response) => setProducts(response.data.products))
        .catch((error) => console.error("Error fetching products:", error));
    }
  }, [category, sellerId]);

  return (
    <div>
      <h2>Products in {category.replace(/_/g, " ")}</h2>
      <Grid container spacing={3} justifyContent="center">
        {products.length ? (
          products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    width: 250,
                    boxShadow: 3,
                    borderRadius: 2,
                    cursor: "pointer",
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.image_url} // Make sure the image URL is correct
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography variant="h6" textAlign="center" noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {product.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ${product.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rating: {product.average_rating} ⭐
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </Grid>
    </div>
  );
};

export default ProductList;
