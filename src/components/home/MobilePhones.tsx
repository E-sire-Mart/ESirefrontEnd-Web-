import React from 'react';

interface Product {
  id: string | number;
  image: string;
  title: string;
  name: string;
  currentPrice: number;
  originalPrice: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountPercentage = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm group hover:shadow-2xl transition-all duration-300 relative border border-gray-100">
      {/* Product Image Container */}
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {discountPercentage > 0 && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
            {discountPercentage}% OFF
          </span>
        )}
        
        {/* Quick View Button - Hidden by default, shown on hover */}
        <div className="absolute bg-black/50 backdrop-blur-sm inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
          <button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 cursor-pointer rounded-full text-sm font-medium transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg hover:shadow-xl"
            onClick={() => {/* Handle quick view */}}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-3">
        <h3 className="text-sm text-gray-800 line-clamp-2 h-10 group-hover:text-purple-600 transition-colors duration-300 font-medium">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-3">
          <span className="text-purple-600 font-bold text-lg">AED {product.currentPrice}</span>
          {product.originalPrice && (
            <span className="text-gray-400 text-sm line-through">
              AED {product.originalPrice}
            </span>
          )}
        </div>
      </div>

      {/* Add to Cart Button - Hidden by default, shown on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-300 rounded-b-xl">
        <button 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-pink-700 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => {/* Handle add to cart */}}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

const MobilePhones: React.FC = () => {
  const mobilePhonesData: Product[] = [
    {
      id: 1,
      image: "/assets/products/mobile/1.webp",
      title: "N95 PRO Top Phone",
      name: "N95 PRO Top Phone English Arabic Keyboard Cell Phone",
      currentPrice: 118,
      originalPrice: 240
    },
    {
      id: 2,
      image: "/assets/products/mobile/2.webp",
      title: "Nokia 5710 XpressAudio",
      name: "Nokia 5710 Xpress Audio Feature Phone with Built-in Wireless Earbuds",
      currentPrice: 99,
      originalPrice: 400
    },
    {
      id: 3,
      image: "/assets/products/mobile/3.webp",
      title: "iPhone 15 Pro Max",
      name: "Apple iPhone 15 Pro Max 256 GB - White Titanium, Middle East Version",
      currentPrice: 3699,
      originalPrice: 6000
    },
    {
      id: 4,
      image: "/assets/products/mobile/4.webp",
      title: "Samsung Galaxy S23 Ultra",
      name: "Samsung Galaxy S23 Ultra 5G Dual SIM Lavender 12GB RAM 256GB Storage",
      currentPrice: 3199,
      originalPrice: 4800
    },
    {
      id: 5,
      image: "/assets/products/mobile/5.webp",
      title: "iPhone 15",
      name: "Apple iPhone 15 256 GB - Pink, Middle East Version",
      currentPrice: 3599,
      originalPrice: 4440
    },
    {
      id: 6,
      image: "/assets/products/mobile/6.webp",
      title: "iPhone 15 Pro",
      name: "Apple iPhone 15 Pro 256 GB - Black Titanium, Middle East Version",
      currentPrice: 4499,
      originalPrice: 6000
    }
  ];

  return (
    <div className="mx-auto py-8 px-5 first-carousel">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mobile Phones
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-2"></div>
        </div>
        <button className="text-purple-600 hover:text-pink-600 font-semibold transition-colors duration-300 hover:underline cursor-pointer">
          View All →
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {mobilePhonesData.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MobilePhones;
