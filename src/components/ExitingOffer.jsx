import React, { useRef, useState, useEffect } from "react";
import image1 from "../assets/home_transfer_images/6.png";
import image2 from "../assets/home_transfer_images/7.png";
import image3 from "../assets/home_transfer_images/9.png";
import image4 from "../assets/home_transfer_images/11.png";
import image5 from "../assets/home_transfer_images/14.png";
import image6 from "../assets/home_transfer_images/18.png";
import image7 from "../assets/home_transfer_images/20.png";
import image8 from "../assets/home_transfer_images/21.png";

const newsItems = [
  {
    title: "Dr. Abdullah Abdullah's Presidential Election Campaign",
    category: "Politics",
    date: "25",
    month: "May",
    timer: Date.now(),
    discountedPrice: "399",
    originalPrice: "698",
    discount: "43%",
    image: image1,
  },
  {
    title: "Afghanistan's President Ashraf Ghani Speaks At The Council",
    category: "Politics",
    date: "10",
    month: "Mar",
    timer: Date.now(),
    discountedPrice: "399",
    originalPrice: "698",
    discount: "43%",
    image: image2,
  },
  {
    title: "Middle East Participants Gather In Warsaw",
    category: "Politics",
    date: "20",
    month: "Jan",
    timer: Date.now(),
    discountedPrice: "399",
    originalPrice: "698",
    discount: "43%",
    image: image3,
  },
  {
    title: "Afghan President Ashraf Ghani Visits Jalalabad",
    category: "Politics",
    date: "25",
    month: "May",
    timer: Date.now(),
    discountedPrice: "399",
    originalPrice: "698",
    discount: "43%",
    image: image4
  },
  {
    title: "Afghan President Ashraf Ghani Visits Jalalabad",
    category: "Politics",
    date: "25",
    month: "May",
    timer: Date.now(),
    discountedPrice: "399",
    originalPrice: "698",
    discount: "43%",
    image: image5
  },
  {
    title: "Afghan President Ashraf Ghani Visits Jalalabad",
    category: "Politics",
    date: "25",
    month: "May",
    timer: Date.now(),
    discountedPrice: "399",
    originalPrice: "698",
    discount: "43%",
    image: image6,
  },
  {
    title: "Afghan President Ashraf Ghani Visits Jalalabad",
    category: "Politics",
    date: "25",
    month: "May",
    timer: Date.now(),
    discountedPrice: "399",
    originalPrice: "698",
    discount: "43%",
    image: image7,
  },
  {
    title: "Afghan President Ashraf Ghani Visits Jalalabad",
    category: "Politics",
    date: "25",
    month: "May",
    timer: Date.now(),
    discountedPrice: "399",
    originalPrice: "698",
    discount: "43%",
    image: image8,
  },
];

const Timer = () => {
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
  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    <div className="text-white text-sm font-medium">
      {formatNumber(time.hours)}: {formatNumber(time.minutes)}: {formatNumber(time.seconds)}
    </div>
  );
};

const ExitingOffer = () => {
  const carouselRef = useRef(null);
  const itemWidth = 320; // Adjust width as needed

  const scrollLeft = () => {
    if (carouselRef.current.scrollLeft === 0) {
      carouselRef.current.scrollTo({
        left: newsItems.length * itemWidth,
        behavior: "instant",
      });
    }
    carouselRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (
      carouselRef.current.scrollLeft + carouselRef.current.clientWidth >=
      carouselRef.current.scrollWidth
    ) {
      carouselRef.current.scrollTo({ left: 0, behavior: "instant" });
    } else {
      carouselRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto relative first-carousel px-5">
      <p className="text-xl sm:text-2xl font-bold text-gray-800 pb-10 pt-4">Exiting Offer</p>
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-5 md:left-20 top-1/2 transform -translate-y-1/2 p-3 bg-gray-200 text-grey-800 rounded-full shadow-lg hover:bg-gray-100 z-10"
        >
          ◀
        </button>
        <div
          ref={carouselRef}
          className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide"
        >
          {newsItems.map((item, index) => (
            <div
              key={index}
              className="relative flex-none w-80 h-[250px] bg-pink-500 rounded-lg shadow-lg p-5"
              style={{
                background: 'linear-gradient(to right, #e94c89,rgb(121, 3, 218))'
              }}
            >
              {/* Replace the static timer with the Timer component */}
              <Timer />

              {/* Price and Discount Info */}
              <div className="mt-4">
                <div className="text-white text-2xl font-bold">
                  AED {item.discountedPrice || "399"}
                </div>
                <div className="text-white/80 line-through text-sm">
                  AED {item.originalPrice || "698"}
                </div>
                <div className="text-white text-xl font-bold mt-1">
                  {item.discount || "43%"} Off
                </div>
              </div>

              {/* Product Title */}
              <div className="text-white text-sm mt-2 truncate max-w-[150px]">
                {item.title}
              </div>

              {/* Product Image */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-40 h-40 rounded-lg p-2">
                <img
                  src={item.image}
                  alt={item.title}
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
    </div>
  );
};

export default ExitingOffer;
