// src/app/product/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "../../../context/cart-context";
import {Product} from "../../../types/product";
export default function ProductPage() {
  const { id } = useParams(); // from next/navigation
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      // Replace this with your actual API call to fetch product data
      const fetchProduct = async () => {
        // For demonstration, we'll simulate a fetch
        const fakeProduct: Product = {
          // Removed 'id' property as it does not exist in type 'Product'
          name: "Sample Product",
          description: "This is a great product.",
          price: 100,
          image: "/images/sample-product.jpg",
          _id: "",
          rating: 0,
          discountPrice: 0,
          discountPercentage: "",
          stars: 0,
          timesRated: 0,
          new: "",
          alt: "",
        };
        setProduct(fakeProduct);
      };

      fetchProduct();
    }
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <Image src={product.image} alt={product.alt}
      className="w-full max-w-lg mt-4" />
      <p className="mt-4 text-xl">${product.price}</p>
      <p className="mt-4">{product.description}</p>
      <button
        className="mt-6 p-2 bg-blue-500 text-white rounded"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
}
