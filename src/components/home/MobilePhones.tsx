import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listProductsApi } from '../../services/api/products';
import { SERVER_URL } from '../../services/url';
import { calculateDiscountedPrice, hasActiveDiscount, convertTextToURLSlug } from '../../utils/helper';

interface Product {
  _id: string;
  name: string;
  image: string[];
  price: number;
  compareAtPrice?: number;
  discountPercent: number;
  startDate?: string;
  endDate?: string;
  category?: any;
  // Legacy/alternative fields from backend variants
  productPrice?: number;
  discount?: number;
  productName?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();
    
    // Add safety checks for product data
    if (!product || !product._id) {
      console.warn('Invalid product data:', product);
      return null;
    }
    
    const productPrice = Number(product.price ?? product.productPrice ?? 0) || 0;
    const productDiscountPercent = Number(product.discountPercent ?? product.discount ?? 0) || 0;
    const productName = product.name ?? product.productName ?? 'Unknown Product';
    const isDiscountActive = hasActiveDiscount({ ...product, price: productPrice, discountPercent: productDiscountPercent });
    const discountedPrice = calculateDiscountedPrice(productPrice, productDiscountPercent);
    const firstImage = Array.isArray(product.image) ? product.image[0] : product.image;

    const handleProductClick = () => {
      const pname = convertTextToURLSlug(productName);
      navigate(`/prn/${pname}/prid/${product._id}`);
    };

  return (
    <div 
      className="bg-white p-4 rounded-xl shadow-sm group hover:shadow-2xl transition-all duration-300 relative border border-gray-100 cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Product Image Container */}
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
        <img 
          src={`${SERVER_URL}/${firstImage}`}
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='.3em' fill='%23999' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />
        {product.discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
            {product.discountPercent}% OFF
          </span>
        )}
        
        {/* Quick View Button - Hidden by default, shown on hover */}
        <div className="absolute bg-black/50 backdrop-blur-sm inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
          <button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 cursor-pointer rounded-full text-sm font-medium transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg hover:shadow-xl"
            onClick={(e) => {
              e.stopPropagation();
              handleProductClick();
            }}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-3">
        <h3 className="text-sm text-gray-800 line-clamp-2 h-10 group-hover:text-purple-600 transition-colors duration-300 font-medium">
          {productName}
        </h3>
        
        <div className="flex items-center gap-3">
          {isDiscountActive ? (
            <>
              <span className="text-purple-600 font-bold text-lg">AED {discountedPrice.toFixed(0)}</span>
            <span className="text-gray-400 text-sm line-through">
                AED {Number(product.compareAtPrice || productPrice).toFixed(0)}
            </span>
            </>
          ) : (
            <span className="text-purple-600 font-bold text-lg">AED {productPrice.toFixed(0)}</span>
          )}
        </div>
      </div>

      {/* Add to Cart Button - Hidden by default, shown on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-300 rounded-b-xl">
        <button 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-pink-700 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            // Handle add to cart
          }}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

const MobilePhones: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadElectronicsProducts = async () => {
      try {
        setLoading(true);
        // Match the working category page: query backend with category 'Eletronic'
        const payload = {
          searchText: "",
          shopId: "",
          category: 'Eletronic',
          nearby: false,
          page: 1,
          limit: 20,
        };
        const response = await listProductsApi(payload);
        // Backend returns an array of shops each with products
        const allProducts = Array.isArray(response)
          ? response.flatMap((shop: any) => shop.products || [])
          : Array.isArray(response?.products)
            ? response.products
            : Array.isArray(response?.data)
              ? response.data
              : (response || []).flatMap((shop: any) => shop?.products || []);

        // Only keep items with valid ids and names
        const normalized = allProducts
          .filter((p: any) => p && (p._id || p.id))
          .map((p: any) => ({
            ...p,
            _id: p._id || p.id,
            name: p.name || p.productName || 'Product',
            price: Number(p.price || p.productPrice || 0),
            discountPercent: Number(p.discountPercent || p.discount || 0),
          }));

        // Limit to 4 like the category page preview
        setProducts(normalized.slice(0, 4));
      } catch (error) {
        console.error('Error loading electronics products (simple path):', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const loadElectronicsProductsFallback = async () => {
      try {
        console.log('Using fallback method for electronics products...');
        
        const data = {
          searchText: "",
          shopId: "",
          category: "",
          nearby: false,
          page: 1,
          limit: 100,
        };
        
        const response = await listProductsApi(data);
        let allProducts = [];
        
        if (Array.isArray(response)) {
          allProducts = response;
        } else if (response && Array.isArray(response.products)) {
          allProducts = response.products;
        } else if (response && Array.isArray(response.data)) {
          allProducts = response.data;
        } else {
          allProducts = response.flatMap((shop: any) => shop.products || []);
        }
        
        // Fallback filtering by product name
        const electronicsProducts = allProducts.filter((product: any) => {
          const productName = product.name || "";
          return (
            productName.toLowerCase().includes('laptop') ||
            productName.toLowerCase().includes('iphone') ||
            productName.toLowerCase().includes('phone') ||
            productName.toLowerCase().includes('mobile') ||
            productName.toLowerCase().includes('computer') ||
            productName.toLowerCase().includes('tablet')
          );
        });
        
        console.log('Fallback Electronics products:', electronicsProducts.length);
        setProducts(electronicsProducts);
      } catch (error) {
        console.error('Fallback method also failed:', error);
        setProducts([]);
      }
    };

    loadElectronicsProducts();
  }, []);

  const handleViewAll = () => {
    navigate('/products/category/Electronics');
  };

  if (loading) {
    return (
      <div className="mx-auto py-8 px-5 first-carousel">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading electronics products...</div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto py-8 px-5 first-carousel">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Electronics
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-2"></div>
          </div>
        </div>
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No electronics products found. Check browser console for debugging info.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-8 px-5 first-carousel">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Electronics
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-2"></div>
        </div>
        <button 
          onClick={handleViewAll}
          className="text-purple-600 hover:text-pink-600 font-semibold transition-colors duration-300 hover:underline cursor-pointer"
        >
          View All →
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {products.map((product, index) => (
          <ProductCard key={product._id || `product-${index}`} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MobilePhones;
