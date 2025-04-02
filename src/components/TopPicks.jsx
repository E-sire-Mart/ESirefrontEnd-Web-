import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col justify-between">
    <img 
      src={product.image} 
      alt={product.title}
      className="w-full h-24 sm:h-32 object-contain mb-2"
    />
    <div className="space-y-1">
      <h4 className="text-xs sm:text-sm text-gray-700 line-clamp-2">{product.title}</h4>
      <div className="flex items-center justify-between">
        <div className="font-bold text-blue-900">
          <span className="text-xs">AED</span>
          <span className="text-md sm:text-base pl-3">{product.price}</span>
        </div>
        <span className="text-white text-xs font-semibold bg-[#ff4747] rounded-[5px] px-2 py-1">
          {product.discount}% OFF
        </span>
      </div>
      <button 
        className="w-full py-1.5 text-xs sm:text-sm text-blue-600 border border-blue-600 rounded hover:text-white hover:bg-blue-600 transition-colors"
      >
        ADD TO CART
      </button>
    </div>
  </div>
);

const BannerCard = ({ banner }) => (
  <div className="relative w-full h-full">
    <img 
      src={banner.image}
      alt={banner.title}
      className="w-full h-full object-cover rounded-lg"
    />
    <div className="absolute bottom-4 left-4">
      <h3 className="text-white text-2xl font-bold mb-2">{banner.title}</h3>
      <button className="bg-white/90 text-black px-4 py-1 rounded-full text-sm hover:bg-white">
        {banner.buttonText}
      </button>
    </div>
  </div>
);

const TopPicks = ({bannerDatas, topPicksDatas }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
  useEffect(() => {
    if (topPicksDatas?.length && bannerDatas?.length) {
      // Create slides with 8 products each
      const slideCount = Math.ceil(topPicksDatas.length / 8);
      const newSlides = [];

      for (let i = 0; i < slideCount; i++) {
        const startIndex = i * 8;
        const slideProducts = topPicksDatas.slice(startIndex, startIndex + 8);
        newSlides.push({
          banner: bannerDatas[i % bannerDatas.length], // Cycle through banners
          products: slideProducts
        });
      }
      
      setSlides(newSlides);
    }
  }, [topPicksDatas, bannerDatas]);
  useEffect(() => {
    let autoplayTimer;
    if (isAutoPlay) {
      const autoplayTimer = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 3000);  //   change slide every 3 seconds

    //   cleanup timer on unmount or when autoplay is disabled
      return () => {
        if(autoplayTimer){
            clearInterval(autoplayTimer);
        }
      }
    }
  }, [isAutoPlay, slides.length]);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  if (!slides.length) return null;

  const currentSlideData = slides[currentSlide];
  
  return (
    <div className="first-carousel mx-auto px-2 sm:px-4 my-4 sm:my-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Top Picks from popular brands</h2>
      
      <div className="bg-[#ff4747] rounded-xl sm:rounded-2xl p-3 sm:p-4">
        <div className="grid lg:grid-cols-5 grid-cols-1 gap-4">
          {/* Banner Section */}
          <div className="col-span-3 lg:col-span-2">
            <div className="relative w-full h-full">
              <BannerCard banner={currentSlideData.banner} />
              
              {slides.length > 1 && (
                <div className="flex justify-between w-full absolute top-1/2 -translate-y-1/2 px-4">
                  <button 
                    onClick={prevSlide}
                    className="bg-white p-2 rounded-full shadow-lg z-10 hover:bg-white/90 transition-colors"
                  >
                    <ChevronLeftIcon className="h-6 w-6 text-black" />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="bg-white p-2 rounded-full shadow-lg z-10 hover:bg-white/90 transition-colors"
                  >
                    <ChevronRightIcon className="h-6 w-6 text-black" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-span-3 lg:col-span-3 md:col-span-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentSlideData.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPicks;
