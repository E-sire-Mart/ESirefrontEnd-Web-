import { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CarouselButtonGroup from "../CarouselButtonGroup";
import { SERVER_URL } from "../../services/url";

const responsive = {
  desktop: {
    breakpoint: { max: 1920, min: 1440 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1440, min: 1024 },
    items: 5,
  },
  mobile: {
    breakpoint: { max: 1024, min: 0 },
    items: 1,
  },
};

const ProductGallery = ({ images }: { images: string[] | string }) => {
  const [coverIndex, setCoverIndex] = useState(0);
  
  // Handle images prop - it might be an array or a comma-separated string
  const getImagesArray = () => {
    if (!images) return [];
    
    // If images is already an array, return it
    if (Array.isArray(images)) {
      return images;
    }
    
    // If images is a string, split by comma and clean up
    if (typeof images === 'string') {
      return images.split(',').map(img => img.trim()).filter(img => img.length > 0);
    }
    
    return [];
  };

  const imagesArray = getImagesArray();
  
  // Don't render if no images
  if (imagesArray.length === 0) {
    return (
      <div className="flex flex-col mb-6 lg:mb-0 lg:border-b _border-muted">
        <div className="hidden lg:flex justify-center">
          <div className="h-[480px] w-[480px] bg-gray-100 flex items-center justify-center">
            <span className="text-gray-500">No images available</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-6 lg:mb-0 lg:border-b _border-muted">
      <div className="hidden lg:flex justify-center">
        <img
          src={`${SERVER_URL}/${imagesArray[coverIndex]}`}
          className="h-[480px] w-[480px] object-contain"
          alt="Product"
          onError={(e) => {
            // Fallback to a placeholder image if the image fails to load
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='480' viewBox='0 0 480 480'%3E%3Crect width='480' height='480' fill='%23f0f0f0'/%3E%3Ctext x='240' y='240' text-anchor='middle' dy='.3em' fill='%23999' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>
      <div className="w-screen lg:w-full">
        <div className="relative mx-10">
          <div className="lg:w-[80%] mt-2.5 mb-8 mx-auto lg:h-[76px]">
            <div className="flex-1 overflow-auto">
              <Carousel
                swipeable={false}
                draggable={false}
                responsive={responsive}
                arrows={false}
                renderButtonGroupOutside={true}
                customButtonGroup={<CarouselButtonGroup />}
                shouldResetAutoplay={false}
                infinite={false}
                renderDotsOutside={true}
                dotListClass={"lg:hidden -bottom-4"}
                showDots={true}
                itemClass="text-center"
              >
                {imagesArray?.map((item, i) => (
                  <div
                    key={i}
                    className={`w-[374px] h-[374px] lg:h-[66px] lg:w-[66px] mx-auto rounded-lg cursor-pointer lg:border ${
                      coverIndex === i ? "border-[#0c831f]" : "_border-muted"
                    } overflow-hidden`}
                    onClick={() => setCoverIndex(i)}
                  >
                    <img
                      src={`${SERVER_URL}/${item}`}
                      alt="Product thumbnail"
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        // Fallback to a placeholder image if the image fails to load
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='66' height='66' viewBox='0 0 66 66'%3E%3Crect width='66' height='66' fill='%23f0f0f0'/%3E%3Ctext x='33' y='33' text-anchor='middle' dy='.3em' fill='%23999' font-size='10'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
