import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listDiscountedProductsApi } from '../services/api/products';
import { SERVER_URL } from '../services/url';
import { calculateDiscountedPrice, hasActiveDiscount, convertTextToURLSlug } from '../utils/helper';
import { ProductItemWithRating } from '../utils/types';

const DiscountedProducts: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductItemWithRating[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDiscountedProducts = async () => {
      try {
        setLoading(true);
        const discountedProducts = await listDiscountedProductsApi();
        setProducts(discountedProducts || []);
      } catch (error) {
        console.error('Error loading discounted products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadDiscountedProducts();
  }, []);

  const handleProductClick = (product: ProductItemWithRating) => {
    const pname = convertTextToURLSlug(product.name);
    navigate(`/prn/${pname}/prid/${product._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600 dark:text-gray-400">Loading discounted products...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            All Discounted Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {products.length} products with special discounts
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => {
              const isDiscountActive = hasActiveDiscount(product);
              const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercent || 0);
              const firstImage = Array.isArray(product.image) ? product.image[0] : product.image;

              return (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="aspect-square relative">
                    <img
                      src={`${SERVER_URL}/${firstImage}`}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='.3em' fill='%23999' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    {/* Discount Badge */}
                    {product.discountPercent > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {product.discountPercent}% OFF
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="space-y-1">
                      {isDiscountActive ? (
                        <div>
                          <div className="text-lg font-bold text-red-600">
                            AED {discountedPrice.toFixed(0)}
                          </div>
                          <div className="text-sm text-gray-500 line-through">
                            AED {product.price.toFixed(0)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          AED {product.price.toFixed(0)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg">
              No discounted products available at the moment.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountedProducts;
