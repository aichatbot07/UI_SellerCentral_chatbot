import { useNavigate } from "react-router-dom";

const categories = [
  "ALL BEAUTY",
  "Musical_Instruments",
  "Health & Personal_Care",
  "Appliance",
  "Amazon_Fashion",
];

const CategoryCard = () => {
  const navigate = useNavigate();
  const sellerId = localStorage.getItem("seller_id"); // Assuming seller ID is stored in localStorage

  const handleCategoryClick = (category) => {
    if (sellerId) {
      navigate(`/products?category=${category}`);
    } else {
      alert("Seller ID not found. Please log in.");
    }
  };

  return (
    <div className="category-container">
      {categories.map((category) => (
        <div key={category} className="category-card" onClick={() => handleCategoryClick(category)}>
          {category.replace(/_/g, " ")}
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
