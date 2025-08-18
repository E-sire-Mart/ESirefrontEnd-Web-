import React from 'react';
import image1 from "../../assets/banner/1.jpg";
import image2 from "../../assets/banner/2.jpg";
import image3 from "../../assets/shop_banners/1.jpg";
import image4 from "../../assets/shop_banners/2.jpg";
import image5 from "../../assets/shop_banners/3.jpg";
import image6 from "../../assets/shop_banners/4.jpg";

interface LargeBannerProps {
  title: string;
  subtitle: string;
  image: string;
  bgColor: string;
}

interface SmallBannerProps {
  title: string;
  subtitle: string;
  image: string;
  bgColor?: string;
}

const LargeBanner: React.FC<LargeBannerProps> = ({ title, subtitle, image, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-lg relative `}>
 
      {/* Right Image */}
        <div className="relative h-full w-full h-auto">
          <div className=" right-0">
            <div className="relative">
              <img 
                src={image} 
                alt={title} 
                className="relative z-10 w-full h-full object-cover rounded-[10px]"
              />
            </div>
          </div>
        </div>
      </div>
  );
};

const SmallBanner: React.FC<SmallBannerProps> = ({ title, subtitle, image, bgColor }) => {
  return (
    <div className="relative h-auto" >
          <div className="relative w-full h-full mx-auto">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-contain rounded-[10px]"
            />
          </div>
      </div>
  );
};

const PromotionalBanners: React.FC = () => {
  const banners = [
    {
      id: 1,
      title: "Pre-Owned",
      subtitle: "Mobiles",
      image: image1,
      type: "large"
    },
    {
      id: 2,
      title: "Pre-Owned",
      subtitle: "Laptops",
      image: image2,
      type: "large"
    },
    {
      id: 3,
      title: "Smart Phones",
      subtitle: "Up to 50% off",
      image: image3,
      type: "small"
    },
    {
      id: 4,
      title: "Smart Watch",
      subtitle: "Up to 50% off",
      image: image4,
      type: "small"
    },
    {
      id: 5,
      title: "Beauty Cosmetics",
      subtitle: "Up to 50% off",
      image: image5,
      type: "small"
    },
    {
      id: 6,
      title: "Perfume",
      subtitle: "Up to 50% off",
      image: image6,
      type: "small"
    }
  ];

  return (
    <div className="first-carousel mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Large Banners */}
        {banners.filter(banner => banner.type === 'large').map(banner => (
          <LargeBanner
            key={banner.id}
            title={banner.title}
            subtitle={banner.subtitle}
            image={banner.image}
            bgColor="bg-gradient-to-r from-purple-600 to-purple-400"
          />
        ))}

        {/* Small Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banners.filter(banner => banner.type === 'small').slice(0, 2).map(banner => (
            <SmallBanner
              key={banner.id}
              title={banner.title}
              subtitle={banner.subtitle}
              image={banner.image}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banners.filter(banner => banner.type === 'small').slice(2, 4).map(banner => (
            <SmallBanner
              key={banner.id}
              title={banner.title}
              subtitle={banner.subtitle}
              image={banner.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanners;
