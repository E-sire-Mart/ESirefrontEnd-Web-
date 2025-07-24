import { useState } from "react";
import "./style.css"; // Assuming the styles are shared
// Dummy Data for Products and Categories
const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Books",
  "Home Goods",
  "Groceries",
  "Vegetables",
  "Fruits",
];

const products = [
  {
    id: 1,
    name: "Lijjat Moong Papad",
    weight: "200 g",
    price: 77,
    image: "logo-192.png",
  },
  {
    id: 2,
    name: "Haldiram's Bhujia",
    weight: "400 g",
    price: 111,
    image: "logo-192.png",
  },
  {
    id: 3,
    name: "Haldiram's Salted Peanuts",
    weight: "200 g",
    price: 54,
    image: "logo-192.png",
  },
  {
    id: 4,
    name: "Doritos Cheese Nachos",
    weight: "53 g",
    price: 30,
    image: "logo-192.png",
  },
  {
    id: 5,
    name: "Lay's Magic Masala Chips",
    weight: "48 g",
    price: 20,
    image: "logo-192.png",
  },
];

// ProductCard Component
const ProductCard = ({
  product,
}: {
  product: {
    id: number;
    name: string;
    weight: string;
    price: number;
    image: string;
  };
}) => {
  return (
    <div className="product-card">
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          style={{ width: "150px", height: "150px" }}
        />
      </div>
      <div className="product-details">
        <h4>{product.name}</h4>
        <p
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {product.weight}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>₹{product.price}</p>
          <button className="add-button">Add</button>
        </div>
      </div>
    </div>
  );
};

// CategoryBar Component
const CategoryBar = ({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) => {
  return (
    <div
      className="category-bar"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        // borderBottom: "1px solid red",
        paddingLeft: "3rem",
        paddingRight: "3rem",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {categories.map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category
                ? "category-button active"
                : "category-button"
            }
            onClick={() => onCategoryChange(category)}
            style={{ border: "none", width: "10rem" }}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

// Main ProductViewAll Component
const ProductViewAll: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <div>
      <div
        className="product-view-all"
        style={{ paddingTop: "86px", paddingRight: "0", paddingLeft: "0" }}
      >
        <CategoryBar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductViewAll;
