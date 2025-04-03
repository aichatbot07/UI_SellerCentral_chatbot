import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CategoryProducts = () => {
  const { category } = useParams(); // Get category from URL
  const [products, setProducts] = useState([]); // Default to an empty array
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Store error if API fails

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/products/category/${category}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []); // Ensure products is always an array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [category]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{category.replace(/_/g, " ")} Products</h2>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border rounded-lg shadow-lg p-4">
              <img src={product.image_url} alt={product.name} className="w-full h-32 object-cover" />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-green-600 font-bold">${product.price}</p>
            </div>
          ))
        ) : (
          <p>No products found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
