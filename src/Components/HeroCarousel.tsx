"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";

interface CarouselItem {
  id: string;
  logo?: string;
  product: string;
  discount: string;
  img: string;
  alt: string;
  quickLink: string; // Ensure this matches your data source
}

interface HeroCarouselProps {
  data: { heroCarouselData: CarouselItem[] };
}

export default function HeroCarousel({ data }: HeroCarouselProps) {
  const { heroCarouselData } = data;
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setSlide((prev) => (prev === heroCarouselData.length - 1 ? 0 : prev + 1));
    }, 10000);

    return () => clearInterval(slideInterval);
  }, [heroCarouselData.length]);

  return (
    <div className="flex mt-10 max-lg:mt-4 w-full h-[18rem] max-sm:h-[12rem] overflow-hidden relative bg-black">
      {heroCarouselData.map((item, index) => (
        <div
          className={slide === index ? "flex gap-3 w-full h-full shrink-0" : "hidden"}
          key={item.id} // Use item.id for a unique key
        >
          <div className="w-1/2 h-full text-primary flex flex-col justify-center gap-5 p-4">
            <div className="flex gap-3 items-center">
              {item.logo && (
                <Image
                  className="w-[3rem] h-[3rem] max-sm:w-[2rem] max-sm:h-[2rem]"
                  src={item.logo}
                  alt={item.product}
                  width={48}
                  height={48}
                  priority
                />
              )}
              <h3 className="text-2xl max-lg:text-xl max-sm:text-sm max-sm:leading-4">
                {item.product}
              </h3>
            </div>
            <h2 className="text-4xl max-lg:text-2xl max-sm:text-[0.8rem] max-sm:leading-4 font-bold w-full">
              {item.discount}
            </h2>
            <Link
              className="flex items-center gap-3 max-sm:text-[0.8rem] hover:text-action hover:underline transition-all w-max"
              href={item.quickLink} // Provide a fallback if quickLink is undefined
            >
              Shop Now <HiArrowRight />
            </Link>
          </div>
          <Image className="w-1/2 h-full" src={item.img} alt={item.alt} width={500} height={300} priority />
        </div>
      ))}
      {/* Carousel Indicator Dots */}
      <span className="absolute bottom-2 flex gap-3 w-full justify-center">
        {heroCarouselData.map((_, index) => (
          <button
            className={`rounded-full w-2 h-2 ${slide === index ? "bg-action" : "bg-secondary"}`}
            key={index}
            onClick={() => setSlide(index)}
          ></button>
        ))}
      </span>
    </div>
  );
}