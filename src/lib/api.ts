// src/lib/api.ts

import { Product } from "../types/product";

// Sample product data
const mockProducts: Product[] = [
  {
    _id: "1",
    name: "Smartphone X",
    description: "A powerful smartphone with advanced features.",
    price: 999.99,
    image: "/images/smartphone.jpg",
    alt: "Smartphone X",
    rating: 86,
    discountPrice: 1200,
    discountPercentage: "23%",
    stars: 5,
    timesRated: 5,
    new: "New",
  },
  {
    _id: "2",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones for music lovers.",
    price: 199.99,
    image: "/images/headphones.jpg",
    alt: "Smartphone X",
    rating: 86,
    discountPrice: 1200,
    discountPercentage: "23%",
    stars: 5,
    timesRated: 5,
    new: "New",
  },
  {
    _id: "3",
    name: "Gaming Laptop",
    description: "A high-end laptop for the ultimate gaming experience.",
    price: 1899.99,
    image: "/images/laptop.jpg",
    alt: "Smartphone X",
    rating: 86,
    discountPrice: 1200,
    discountPercentage: "23%",
    stars: 5,
    timesRated: 5,
    new: "New",
  },
];

// Fetch all products
export async function fetchProducts(): Promise<Product[]> {
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProducts), 500);
  });
}

// Fetch a product by ID
export async function fetchProductById(id: string): Promise<Product | undefined> {
  return mockProducts.find((product) => product._id === id);
}
