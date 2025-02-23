"use client";

import { HiArrowRight, HiArrowLeft, HiOutlineHeart, HiOutlineEye } from "react-icons/hi";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import StarRatings from "react-star-ratings";
import { useCart } from "../context/cart-context";
import { useWishlist } from "../context/wishlist-context";
import ItemSkeleton from "../app/skeletons/ItemSkeleton";
import { Product } from "@/types/product";


export default function FlashSales() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  // Set initial countdown date
  const [targetDate] = useState(() => {
    const initialDate = new Date();
    initialDate.setDate(initialDate.getDate() + 6);
    initialDate.setSeconds(initialDate.getSeconds() - 45);
    return initialDate;
  });

  // Function to calculate time left for the countdown
  const calculateTimeLeft = useCallback(() => {
    const difference = +targetDate - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, "0"),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, "0"),
        minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, "0"),
        seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, "0"),
      };
    }
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // Fetch products data
  async function getProducts() {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch("/data/flashSalesProducts.json");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setProducts(data.flashSalesProducts);
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
    <section className="w-full px-[7%] my-14 max-sm:mt-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="block w-[1.3rem] h-[3rem] rounded-md bg-accent"></span>
        <h5 className="text-base text-action font-bold">Today’s</h5>
      </div>
      <div className="flex w-full max-sm:h-[5.5rem] items-center max-sm:items-start gap-6 mb-8 justify-between relative">
        <h2 className="text-3xl font-bold max-sm:text-xl">Flash Sales</h2>
        <div className="flex text-base max-sm:text-sm gap-4 max-sm:gap-2 items-end max-sm:absolute max-sm:bottom-0 max-sm:w-full max-sm:mt-4 justify-center">
          {Object.entries(timeLeft).map(([key, value], index) => (
            <div key={key} className="flex flex-col items-center">
              <span className="text-2xl max-sm:text-lg font-bold">{value}</span>
              {index < 3 && <span className="text-2xl font-bold text-action">:</span>}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-secondary w-8 h-8 rounded-full transition-all hover:bg-action hover:text-primary flex items-center justify-center">
            <HiArrowLeft />
          </button>
          <button className="bg-secondary w-8 h-8 rounded-full transition-all hover:bg-action hover:text-primary flex items-center justify-center">
            <HiArrowRight />
          </button>
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-6 overflow-x-hidden">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <ItemSkeleton key={index} />)
          : products.map((product) => (
              <div className="flex flex-col gap-1 w-[14rem] max-sm:w-[9rem]" key={product._id}>
                <div className="group flex flex-col items-center justify-center w-full h-[13rem] max-sm:h-[10rem] rounded-md p-4 bg-secondary relative transition-all overflow-hidden">
                  <Image
                    className="hover:scale-[1.2] transition-all"
                    src={product.image}
                    alt={product.name}
                    width={150}
                    height={150}
                    priority
                  />
                  <span className="absolute px-2 rounded-md bg-accent left-3 top-2 text-sm text-primary">
                    {product.discountPercentage}
                  </span>
                  <div className="absolute top-2 right-3 flex flex-col gap-4">
                    <button className="bg-white w-6 h-6 rounded-full flex items-center justify-center p-[1px]" onClick={() => addToWishlist(product)}>
                      <HiOutlineHeart className="w-full h-full" />
                    </button>
                    <Link href={`/product/${product._id}`} className="bg-white w-6 h-6 rounded-full flex items-center justify-center p-[1px]">
                      <HiOutlineEye className="w-full h-full" />
                    </Link>
                  </div>
                  <button className="w-full h-[2rem] absolute bottom-0 bg-black text-primary hidden max-lg:block group-hover:block" onClick={() => addToCart(product)}>
                    Add To Cart
                  </button>
                </div>
                <h3 className="text-md font-medium">{product.name}</h3>
                <div className="flex gap-2 items-center">
                  <span className="text-action">${product.discountPrice}</span>
                  <span className="line-through">${product.price}</span>
                </div>
                <div>
                  <StarRatings rating={product.stars} starDimension="20px" starSpacing="2px" starRatedColor="orange" />
                  <span>({product.timesRated})</span>
                </div>
              </div>
            ))}
      </div>
      <div className="flex mt-8 items-center justify-center w-full">
        <Link className="px-4 py-2 rounded-md bg-action w-max text-primary hover:translate-x-2 hover:-translate-y-1 transition-all" href="/all-products">
          View All Products
        </Link>
      </div>
    </section>
  );
}