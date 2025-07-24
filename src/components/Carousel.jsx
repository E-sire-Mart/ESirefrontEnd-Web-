import React, { useState, useEffect, useRef } from "react";

const CarouselComponents = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);
  useEffect(() => {
    startAutoAdvance();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startAutoAdvance = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.length);
    }, 5000);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % data.length);
    startAutoAdvance();
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + data.length) % data.length);
    startAutoAdvance();
  };
  return (
    <>
      <div className="relative w-full lg:h-[30vw] h-[50vw]">
        <div className="absolute h-full w-full">
          {data.map((item, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-90"
              }`}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-8">
                {/* <h3 className="text-white text-2xl font-bold">{item.name}</h3> */}
                {/* <p className="text-gray-200">{item.alt}</p> */}
              </div>
            </div>
          ))}
        </div>

        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full"
          onClick={handlePrev}
        >
          &#9664;
        </button>

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full"
          onClick={handleNext}
        >
          &#9654;
        </button>
      </div>
    </>
  );
};
export default CarouselComponents;
