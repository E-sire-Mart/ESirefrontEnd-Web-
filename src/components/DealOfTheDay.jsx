import React, { useState, useEffect } from 'react';
import image1 from "../assets/home_transfer_images/3.png";
import image2 from "../assets/home_transfer_images/4.png";
import image3 from "../assets/home_transfer_images/3.webp";
import image4 from "../assets/home_transfer_images/6.png";
import image5 from "../assets/home_transfer_images/7.png";
import image6 from "../assets/home_transfer_images/8.png";
import image7 from "../assets/home_transfer_images/9.png";
import image8 from "../assets/home_transfer_images/10.png";

const Timer = () => {
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => {
        let { hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              // Timer completed
              clearInterval(timer);
              return prevTime;
            }
          }
        }

        return {
          hours,
          minutes,
          seconds
        };
      });
    }, 1000);

    // Cleanup on component unmount
    return () => clearInterval(timer);
  }, []);

  // Format numbers to always show two digits
  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center text-sm text-red-500">
      <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
      {formatNumber(time.hours)}: {formatNumber(time.minutes)}: {formatNumber(time.seconds)}
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg p-4">
      {/* Replace static timer with Timer component */}
      <Timer />

      <div className="flex justify-between mt-2">
        {/* Product Image */}
        <div className="w-1/2">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-32 object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="w-1/2 flex flex-col justify-between">
          {/* Prices */}
          <div>
            <div className="flex items-center gap-1">
              <span className="text-red-500 text-sm">AED</span>
              <span className="text-xl font-bold text-red-500">{product.currentPrice}</span>
            </div>
            <div className="text-gray-400 line-through text-sm">
              AED {product.originalPrice}
            </div>
            <div className="text-red-500 font-bold">
              {product.discount} Off
            </div>
          </div>
          
          {/* Title */}
          <div className="text-sm text-gray-600 line-clamp-2">
            {product.title}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductSection = ({ title, products }) => {
  return (
    <div className="bg-gradient-to-r from-customGreen to-customBlue p-4 rounded-xl lg:w-1/2 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <button className="text-white hover:underline text-sm">View All</button>
      </div>

      {/* Grid of Products */}
      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

const DealsAndSavers = () => {
  const dealOfTheDay = [
    {
      image: image1,
      timer: {
        hours: 4,
        minutes: 30,
        seconds: 0
      },
      currentPrice: "2776.00",
      originalPrice: "3804.00",
      discount: "27%",
      title: "Samsung 55-Inch 4K Smart QLED TV (2024)"
    },
    {
      image: image2,
      timer: {
        hours: 4,
        minutes: 30,
        seconds: 0
      },
      currentPrice: "1999.00",
      originalPrice: "2899.00",
      discount: "31%",
      title: "Hamilton by Yoop X1 Lite Everyday Stroller"
    },
    {
      image: image3,
      timer: {
        hours: 4,
        minutes: 30,
        seconds: 0
      },
      currentPrice: "69.00",
      originalPrice: "104.00",
      discount: "34%",
      title: "Clikon CK2446 Two Slice Sandwich Maker 750W"
    },
    {
      image: image4,
      timer: {
        hours: 4,
        minutes: 30,
        seconds: 0
      },
      currentPrice: "123.00",
      originalPrice: "178.00",
      discount: "31%",
      title: "Olsenmark OMAF2430 Smart Air Fryer 1400W"
    }
  ];

  const saverZone = [
    {
      image: image5,
      timer: {
        hours: 4,
        minutes: 30,
        seconds: 0
      },
      currentPrice: "65.00",
      originalPrice: "139.00",
      discount: "53%",
      title: "Calvin Klein Ck Be EDT 200ml For Unisex"
    },
    {
      image: image6,
      timer: {
        hours: 4,
        minutes: 30,
        seconds: 0
      },
      currentPrice: "69.00",
      originalPrice: "139.00",
      discount: "50%",
      title: "Armaf Club De Nuit Urban Elixir Parfum"
    },
    {
      image: image7,
      timer: {
        hours: 4,
        minutes: 30,
        seconds: 0
      },
      currentPrice: "506.00",
      originalPrice: "665.00",
      discount: "24%",
      title: "Guess GW0598L2 Women 38mm Black G"
    },
    {
      image: image8,
    timer: {
        hours: 3,
        minutes: 20,
        seconds: 0
      },
      currentPrice: "552.00",
      originalPrice: "700.00",
      discount: "21%",
      title: "Ducati DTWGB0000701 Mens 40mm Analog Bla"
    }
  ];

  return (
    <div className="first-carousel mx-auto pt-10 px-5">
      <div className="flex gap-4 flex-col lg:flex-row justify-center items-center ">
        {/* Deal of the Day Section */}
        <ProductSection title="DEAL OF THE DAY" products={dealOfTheDay} />
        
        {/* Saver Zone Section */}
        <ProductSection title="SAVER ZONE" products={saverZone} />
      </div>
    </div>
  );
};

export default DealsAndSavers;