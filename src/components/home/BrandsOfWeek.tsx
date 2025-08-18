import React from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: number | string;
  title: string;
  salePrice: number | string;
  originalPrice: number | string;
  discount: string;
  brand: string;
  model: string;
  image: string; // public URL e.g. /assets/watches/1.webp
}

interface BrandsOfWeekProps {
  data: Product[];
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="bg-white rounded-lg p-4 shadow-md">
    <div className="flex flex-row justify-between">
      <div className="mt-4 flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-bold">AED {product.salePrice}</span>
          <span className="text-gray-400 line-through text-sm">AED {product.originalPrice}</span>
        </div>
        <span className="text-orange-500 text-sm font-semibold">{product.discount} Off</span>
        <h3 className="text-gray-700 text-sm">{product.brand}</h3>
        <p className="text-gray-600 text-xs mb-2">{product.model}</p>
      </div>
      <div className='w-48 h-35'>
        <img src={product.image} alt={product.title} className="w-full h-full object-cover mx-auto" />
      </div>
    </div>
  </div>
);

const BrandsOfWeek: React.FC<BrandsOfWeekProps> = ({ data }) => {
  return (
    <div className="first-carousel mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Brand of the week</h2>
        <Link to="/brand/ducati" className="text-blue-600 hover:text-blue-700">
          View All
        </Link>
      </div>

      <div className="relative bg-black rounded-xl overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full top-0">
          <img src="/assets/all_banners/ducati.jpg" alt="Ducati banner" className="w-full object-contain opacity-100" />
        </div>
        {/* Content Container */}
        <div className="relative z-10">
          {/* Logo Section */}
          <div className="flex justify-center items-center h-[120px] sm:h-[80px]"></div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsOfWeek;
