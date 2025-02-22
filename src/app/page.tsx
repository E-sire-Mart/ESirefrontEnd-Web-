"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import HeroCarousel from "../Components/HeroCarousel";
import heroCarouselData from "./data/heroCarouselData.json";
import Footer from "../Components/Footer";
import { MdNavigateNext } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import FlashSales from "../Components/FlashSales";
import Categories from "../Components/Categories";
import BestSellingProducts from "../Components/BestSellingProducts";
import ExploreOurProducts from "../Components/ExploreOurProducts";
import NewArrivals from "../Components/NewArrivals";
import OurServices from "../Components/OurServices";


export default function Home() {
  const [targetDate] = useState<Date>(() => {
    const initialDate = new Date();
    initialDate.setDate(initialDate.getDate() + 5);
    initialDate.setSeconds(initialDate.getSeconds() - 45);
    return initialDate;
  });

  const [showSecondaryNav, setShowSecondaryNav] = useState<boolean>(false);
  const [isMediumScreen, setIsMediumScreen] = useState<boolean>(typeof window !== "undefined" && window.innerWidth >= 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth >= 640);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMediumScreen) {
      setShowSecondaryNav(false);
    }
  }, [isMediumScreen]);

  const handleDropDown = () => {
    if (!isMediumScreen) {
      setShowSecondaryNav((prev) => !prev);
    }
  };

  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    let timeLeft = {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24))
          .toString()
          .padStart(2, "0"),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24)
          .toString()
          .padStart(2, "0"),
        minutes: Math.floor((difference / 1000 / 60) % 60)
          .toString()
          .padStart(2, "0"),
        seconds: Math.floor((difference / 1000) % 60)
          .toString()
          .padStart(2, "0"),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <>
      <Navbar />
      <section className="flex px-[7%] mb-6 gap-[7rem] w-full justify-between max-lg:flex-col max-lg:gap-4 max-lg:items-center relative">
        <button
          type="button"
          aria-label="Product types quick links dropdown"
          className="hidden max-sm:block"
          onClick={handleDropDown}
        >
          <FaChevronDown className="absolute z-20 top-0 left-[7%] border border-t-0 rounded-b-lg w-8 h-4" />
        </button>
        <nav
          className={`${
            isMediumScreen || showSecondaryNav
              ? "flex flex-col gap-3 text-sm w-[11rem] bg-white pr-2 max-lg:pr-0 pt-10 max-lg:pt-4 border-r-[1px] border-secondary max-lg:border-r-0 h-max max-lg:w-full max-lg:flex-row max-lg:flex-wrap max-lg:justify-center max-sm:absolute z-10 max-sm:px-[7%] max-sm:py-8"
              : "hidden"
          }`}
        >
          {[
            { name: "Women's Fashion", path: "/" },
            { name: "Men's Fashion", path: "/" },
            { name: "Electronics", path: "/" },
            { name: "Home & Lifestyle", path: "/" },
            { name: "Medicine", path: "/" },
            { name: "Sports & Outdoor", path: "/" },
            { name: "Baby's & Toys", path: "/" },
            { name: "Groceries & Pets", path: "/" },
            { name: "Health & Beauty", path: "/" },
          ].map(({ name, path }) => (
            <Link
              key={name}
              href={path}
              className="flex items-center pr-2 justify-between transition-all hover:text-action hover:underline"
            >
              {name} <MdNavigateNext />
            </Link>
          ))}
        </nav>
        <HeroCarousel data={heroCarouselData} />
      </section>
      <FlashSales />
      <Categories />
      <BestSellingProducts />
      <section className="block w-full px-[7%] my-8">
        <div className="w-full max-lg:items-center justify-between bg-black text-primary p-8 items-start">
          <h2 className="text-[1.2rem] mb-6 text-green-cus">Categories</h2>
          <div className="w-full h-full flex max-lg:flex-col-reverse items-center gap-8">
            <div className="w-1/2 max-lg:w-full flex flex-col gap-8 max-lg:items-center">
              <h3 className="text-[3rem] lg:w-3/4 max-lg:text-[2rem] font-bold max-lg:text-center">
                Enhance Your Music Experience
              </h3>
              <div className="flex gap-6">
                {Object.entries(timeLeft).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col gap-0 text-[0.6rem] font-bold p-1 text-secondary rounded-full bg-secondary w-[3.7rem] h-[3.7rem] items-center justify-center"
                  >
                    <span>{value}</span>
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </div>
                ))}
              </div>
              <button className="w-[10rem] rounded-lg font-bold text-lg p-3 hover:translate-x-2 hover:-translate-y-1 transition-all bg-green-cus">
                Buy Now!
              </button>
            </div>
            <Image
              className="w-1/2 max-lg:w-3/4 h-full"
              src="/buy-now-img/music-box.png"
              alt="Music box"
              width={500}
              height={500}
            />
          </div>
        </div>
      </section>
      <ExploreOurProducts />
      <NewArrivals />
      <OurServices />
      <Footer />
    </>
  );
}
