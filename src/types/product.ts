// src/types/product.ts

export interface Product {
  alt: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string; // ✅ This is the correct property
  rating: number;
  discountPrice: number;
  discountPercentage: string;
  stars: number;
  timesRated: number;
  new: string;
}
