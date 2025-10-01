import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { convertTextToURLSlug } from "../../utils/helper";
import { listDiscountedProductsApi } from "../../services/api/products";
import { SERVER_URL } from "../../services/url";

type DiscountProduct = {
  _id: string;
  name: string;
  image: string[];
  price: number;
  compareAtPrice?: number;
  discountPercent: number;
};

const Timer: React.FC = () => {
  const [time, setTime] = useState({
    hours: 29,
    minutes: 57,
    seconds: 28
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
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="text-white text-sm font-medium">
      {formatNumber(time.hours)}: {formatNumber(time.minutes)}: {formatNumber(time.seconds)}
    </div>
  );
};

const ExitingOffer: React.FC = () => {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemWidth = 320; // Adjust width as needed
  const [items, setItems] = useState<DiscountProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const scrollLeft = () => {
    if (carouselRef.current && carouselRef.current.scrollLeft === 0) {
      carouselRef.current.scrollTo({
        left: items.length * itemWidth,
        behavior: "auto",
      });
    }
    carouselRef.current?.scrollBy({ left: -itemWidth, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      if (
        carouselRef.current.scrollLeft + carouselRef.current.clientWidth >=
        carouselRef.current.scrollWidth
      ) {
        carouselRef.current.scrollTo({ left: 0, behavior: "auto" });
      } else {
        carouselRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const products: DiscountProduct[] = await listDiscountedProductsApi();
        setItems(products || []);
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto relative first-carousel px-5">
      <style>
        {`
          .carousel-container::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {items.length > 0 && (
        <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white pb-10 pt-4">Exiting Offer</p>
      )}
      {items.length > 0 && (
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-5 md:left-20 top-1/2 transform -translate-y-1/2 p-3 bg-gray-200 text-grey-800 rounded-full shadow-lg hover:bg-gray-100 z-10"
        >
          ◀
        </button>
        <div
          ref={carouselRef}
          className="flex gap-5 overflow-x-auto scroll-smooth carousel-container"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/prn/${convertTextToURLSlug(item.name)}/prid/${item._id}`)}
              className="relative flex-none w-80 h-[250px] rounded-lg shadow-lg p-5 cursor-pointer hover:shadow-xl transition-shadow"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {/* Discount Badge */}
              {item.discountPercent > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                  {item.discountPercent}% OFF
                </div>
              )}
              {/* Replace the static timer with the Timer component */}
              <Timer />

              {/* Price and Discount Info */}
              <div className="mt-4">
                <div className="text-white text-2xl font-bold">
                  AED {Math.max(0, Number(item.price) * (1 - (item.discountPercent || 0) / 100)).toFixed(0)}
                </div>
                <div className="text-white/80 line-through text-sm">
                  AED {item.compareAtPrice || item.price}
                </div>
                <div className="text-white text-xl font-bold mt-1">
                  {item.discountPercent}% Off
                </div>
              </div>

              {/* Product Title */}
              <div className="text-white text-sm mt-2 truncate max-w-[150px]">
                {item.name}
              </div>

              {/* Product Image */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-40 h-40 rounded-lg p-2">
                <img
                  src={`${SERVER_URL}/${item.image?.[0]}`}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-5 md:right-20 top-1/2 transform -translate-y-1/2 p-3 bg-gray-200 text-gray-800 rounded-full shadow-lg hover:bg-gray-200 z-10"
        >
          ▶
        </button>
      </div>
      )}
    </div>
  );
};

export default ExitingOffer;
