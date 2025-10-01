import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listDiscountedProductsApi } from "../../services/api/products";
import { SERVER_URL } from "../../services/url";
import { calculateDiscountedPrice, hasActiveDiscount, convertTextToURLSlug } from "../../utils/helper";

const Timer: React.FC = () => {
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
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center text-sm text-red-500">
      <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
      {formatNumber(time.hours)}: {formatNumber(time.minutes)}: {formatNumber(time.seconds)}
    </div>
  );
};

interface Product {
  _id: string;
  name: string;
  image: string[];
  price: number;
  compareAtPrice?: number;
  discountPercent: number;
  startDate?: string;
  endDate?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const isDiscountActive = hasActiveDiscount(product);
  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercent);
  const firstImage = Array.isArray(product.image) ? product.image[0] : product.image;

  const handleProductClick = () => {
    const pname = convertTextToURLSlug(product.name);
    navigate(`/prn/${pname}/prid/${product._id}`);
  };
  
  return (
    <div 
      className="bg-white rounded-lg p-4 relative cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleProductClick}
    >
      {/* Discount Badge */}
      {product.discountPercent > 0 && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          {product.discountPercent}% OFF
        </div>
      )}
      
      {/* Replace static timer with Timer component */}
      <Timer />

      <div className="flex justify-between mt-2">
        {/* Product Image */}
        <div className="w-1/2">
          <img 
            src={`${SERVER_URL}/${firstImage}`}
            alt={product.name} 
            className="w-full h-32 object-contain"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23f0f0f0'/%3E%3Ctext x='75' y='75' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>

        {/* Product Details */}
        <div className="w-1/2 flex flex-col justify-between">
          {/* Prices */}
          <div>
            <div className="flex items-center gap-1">
              <span className="text-red-500 text-sm">AED</span>
              <span className="text-xl font-bold text-red-500">{discountedPrice.toFixed(0)}</span>
            </div>
            <div className="text-gray-400 line-through text-sm">
              AED {product.compareAtPrice || product.price}
            </div>
            <div className="text-red-500 font-bold">
              {product.discountPercent}% Off
            </div>
          </div>
          
          {/* Title */}
          <div className="text-sm text-gray-600 line-clamp-2">
            {product.name}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProductSectionProps {
  title: string;
  products: Product[];
}

const ProductSection: React.FC<ProductSectionProps> = ({ title, products }) => {
  const navigate = useNavigate();
  
  const handleViewAll = () => {
    navigate('/discounted-products');
  };

  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-xl lg:w-1/2 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <button 
          onClick={handleViewAll}
          className="text-white hover:underline text-sm bg-purple-700 hover:bg-purple-800 px-3 py-1 rounded transition-colors"
        >
          View All
        </button>
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

const DealsAndSavers: React.FC = () => {
  const [dealOfTheDay, setDealOfTheDay] = useState<Product[]>([]);
  const [saverZone, setSaverZone] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDiscountedProducts = async () => {
      try {
        setLoading(true);
        const products: Product[] = await listDiscountedProductsApi();
        
        // Split products into two groups
        const half = Math.ceil(products.length / 2);
        setDealOfTheDay(products.slice(0, half));
        setSaverZone(products.slice(half));
      } catch (error) {
        console.error('Error loading discounted products:', error);
        setDealOfTheDay([]);
        setSaverZone([]);
      } finally {
        setLoading(false);
      }
    };

    loadDiscountedProducts();
  }, []);

  if (loading) {
    return (
      <div className="first-carousel mx-auto pt-10 px-5">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading deals...</div>
        </div>
      </div>
    );
  }

  if (dealOfTheDay.length === 0 && saverZone.length === 0) {
    return null; // Don't render if no discounted products
  }

  return (
    <div className="first-carousel mx-auto pt-10 px-5">
      <div className="flex gap-4 flex-col lg:flex-row justify-center items-center ">
        {/* Deal of the Day Section */}
        {dealOfTheDay.length > 0 && (
          <ProductSection title="DEAL OF THE DAY" products={dealOfTheDay} />
        )}
        
        {/* Saver Zone Section */}
        {saverZone.length > 0 && (
          <ProductSection title="SAVER ZONE" products={saverZone} />
        )}
      </div>
    </div>
  );
};

export default DealsAndSavers;
