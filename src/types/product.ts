// src/types/product.ts

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  discountPrice: number;
  discountPercentage: string;
  stars: number;
  timesRated: number;
  new: string;
}
