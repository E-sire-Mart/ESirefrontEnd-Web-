import React from 'react';

const ProductCard = ({ product }) => {
  const discountPercentage = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);

  return (
    <div className="bg-white p-4 rounded-lg shadow group hover:shadow-xl transition-all duration-300 relative">
      {/* Product Image Container */}
      <div className="relative h-48 mb-4 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {discountPercentage > 0 && (
          <span className="absolute top-2 left-2 bg-[#ff4747] text-white text-xs px-2 py-1 rounded">
            {discountPercentage}% OFF
          </span>
        )}
        
        {/* Quick View Button - Hidden by default, shown on hover */}
        <div className="absolute bg-black inset-0 bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            className="bg-[#ff4747] text-white px-4 py-2 cursor-pointer rounded-full text-sm font-medium transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            onClick={() => {/* Handle quick view */}}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-2">
        <h3 className="text-sm text-gray-700 line-clamp-2 h-10 group-hover:text-[#ff4747] transition-colors duration-300">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-[#ff4747] font-semibold">AED {product.currentPrice}</span>
          {product.originalPrice && (
            <span className="text-gray-500 text-sm line-through">
              AED {product.originalPrice}
            </span>
          )}
        </div>
      </div>

      {/* Add to Cart Button - Hidden by default, shown on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-300">
        <button 
          className="w-full bg-[#ff4747] text-white py-2 rounded text-sm font-medium hover:bg-[#ff3333] cursor-pointer"
          onClick={() => {/* Handle add to cart */}}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

const PopularProducts = ({type, data}) => {


  return (
    <div className=" mx-auto py-8 px-5 first-carousel">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{type}</h2>
        <button className="text-[#ff4747] hover:underline cursor-pointer">
          View All
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-yellow-10">
        {data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
