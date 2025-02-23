"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import newArrivalsData from "../app/data/newArrivals.json"; // Correct import

interface NewArrival {
  id: string; // Changed to string to match JSON data
  src: string;
  alt: string;
  product: string;
  description: string;
  shopLink: string;
}

export default function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState<NewArrival[]>([]);

  useEffect(() => {
    setNewArrivals(newArrivalsData.newArrivals.map((item) => ({
      ...item,
      shopLink: item["shop link"], // Correct the key name
    })));
  }, []);

  return (
    <section className="w-full px-[7%] my-20">
      <div className="flex items-center gap-3 mb-4">
        <span className="block w-[1.3rem] h-[3rem] rounded-md bg-accent"></span>
        <h5 className="text-base text-action font-bold">Featured</h5>
      </div>
      <div className="flex w-full items-center gap-6 mb-8 justify-between">
        <h2 className="text-3xl max-sm:text-xl font-bold">New Arrival</h2>
      </div>
      <div className="flex w-full gap-6 justify-center max-md:flex-wrap">
        {newArrivals.slice(0, 4).map((newArrival, index) => (
          <div key={newArrival.id} className={`bg-black p-6 ${index < 2 ? 'w-1/2' : 'w-full'} h-full max-md:h-[20rem] max-lg:h-max`}>
            <div className="relative text-primary flex items-center justify-center w-full h-full">
              <Image className="h-full" src={newArrival.src} alt={newArrival.alt} width={300} height={300} />
              <div className="absolute bottom-0 left-0 flex flex-col gap-2 w-1/2 max-lg:w-full">
                <h3 className="text-2xl max-lg:text-xl font-bold">{newArrival.product}</h3>
                <p className="text-base">{newArrival.description}</p>
                <Link className="text-base underline hover:text-action transition-all" href={newArrival.shopLink}>
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}