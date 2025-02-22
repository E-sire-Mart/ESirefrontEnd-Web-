"use client";

import { HiArrowRight, HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import categoriesData from "../app/data/categoriesData.json";
import "@/app/components-css/categories.css"
interface Category {
  id: string; // Changed to string to match JSON data
  icon: string;
  alt: string;
  title: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(categoriesData.categories);
  }, []);

  return (
    <section className="w-full px-[7%] my-20">
      <div className="flex items-center gap-3 mb-4">
        <span className="block w-[1.3rem] h-[3rem] rounded-md bg-accent"></span>
        <h5 className="text-base text-action font-bold">Categories</h5>
      </div>
      <div className="flex w-full items-center gap-6 mb-8 justify-between">
        <h2 className="text-3xl max-sm:text-xl font-bold">Browse By Category</h2>
        <div className="flex items-center gap-4">
          <button className="bg-secondary w-8 h-8 rounded-full transition-all hover:bg-action hover:text-primary flex items-center justify-center">
            <HiArrowLeft />
          </button>
          <button className="bg-secondary w-8 h-8 rounded-full transition-all hover:bg-action hover:text-primary flex items-center justify-center">
            <HiArrowRight />
          </button>
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-6 overflow-x-hidden border-b-[3px] border-secondary pb-16">
        {categories.map((category) => (
          <Link
            className="flex flex-col gap-1 w-[14rem] h-[10rem] max-sm:w-[9rem] max-sm:h-[8rem] border-[3px] border-secondary rounded-lg p-4 items-center justify-center hover:bg-action transition-all hover:text-primary"
            id="category-p"
            href="/"
            key={category.id}
          >
            <Image className="category-icon" src={category.icon} alt={category.alt} width={50} height={50} />
            <h3>{category.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}