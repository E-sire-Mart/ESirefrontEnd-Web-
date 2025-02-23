"use client";

import { HiOutlineHeart, HiOutlineEye } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import StarRatings from "react-star-ratings";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import ItemSkeleton from "@/app/skeletons/ItemSkeleton";
import { Product } from "@/types/product"; // Import the Product type

export default function BestSellingProducts() {
  const [loading, setLoading] = useState<boolean>(true);
  const [bestSellingProducts, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  async function getProducts() {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating delay

      const response = await fetch("/data/bestSellingProducts.json"); // Use absolute path
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setProducts(data.bestSellingProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <section className="w-full px-[7%] my-20">
      <div className="flex items-center gap-3 mb-4">
        <span className="block w-[1.3rem] h-[3rem] rounded-md bg-accent"></span>
        <h5 className="text-base text-action font-bold">This Month</h5>
      </div>
      <div className="flex w-full items-center gap-6 mb-8 justify-between">
        <h2 className="text-3xl max-sm:text-xl font-bold">Best Selling Products</h2>
        <div className="flex items-center gap-4">
          <Link
            className="px-4 py-2 rounded-md bg-action w-max text-primary hover:translate-x-2 hover:-translate-y-1 transition-all"
            href="/all-products"
          >
            View All
          </Link>
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-6 overflow-x-hidden">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <ItemSkeleton key={index} />)
          : bestSellingProducts.map((product) => (
              <div className="flex flex-col gap-1 w-[14rem] max-sm:w-[9rem]" key={product._id}>
                <div className="group overflow-hidden flex flex-col items-center justify-center w-full h-[13rem] max-sm:h-[10rem] rounded-md p-4 bg-secondary relative">
                  <Image
                    className="hover:scale-[1.2] transition-all"
                    src={product.image}
                    alt={product.alt}
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-3 flex flex-col gap-4">
                    <button
                      className="bg-white w-6 h-6 rounded-full flex items-center justify-center p-[1px]"
                      onClick={() => addToWishlist(product)}
                    >
                      <HiOutlineHeart className="w-full h-full" />
                    </button>
                    <Link
                      href={`/product/${product._id}`}
                      className="bg-white w-6 h-6 rounded-full flex items-center justify-center p-[1px]"
                    >
                      <HiOutlineEye className="w-full h-full" />
                    </Link>
                  </div>
                  <button
                    className="w-full h-[2rem] absolute bottom-0 bg-black text-primary hidden max-lg:block group-hover:block"
                    onClick={() => addToCart(product)}
                  >
                    Add To Cart
                  </button>
                </div>
                <h3 className="text-md font-medium">{product.name}</h3>
                <div className="flex gap-2 items-center">
                  <span className="text-action">{`$${product.discountPrice}`}</span>
                  <span className="line-through">{`$${product.price}`}</span>
                </div>
                <div>
                  <StarRatings rating={product.stars} starDimension="20px" starSpacing="2px" starRatedColor="orange" />
                  <span>({product.timesRated})</span>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}