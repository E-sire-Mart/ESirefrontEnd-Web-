import { useEffect, useMemo, useState, useRef } from "react";
import { FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { IoCaretForwardSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { getProductForCart } from "../../utils/helper";
import { getCurrentUserId } from "../../utils/authUtils";
import { allFeatures } from "../BrandPromotion";
import { AddToCartButton } from "../shared";
import Breadcrumb from "./Breadcrumb";
import ProductGallery from "./ProductGallery";
import ProductVarients from "./ProductVarients";
import Review from "../shared/Review";
import { listProductsApi, type ProductSearchPayload } from "../../services/api/products";
import { categoriesService, type Category } from "../../services/api/categories";

const ProductDetails = ({ product }: { product: any }) => {
  const allVarients = [product];
  const [itemIndex, setItemIndex] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const currentProduct = allVarients[itemIndex];
  const productAsCartItem = getProductForCart(currentProduct);
  const navigate = useNavigate();

  // Zoom state for product image
  const imgWrapperRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<{ x: number; y: number; active: boolean }>({ x: 50, y: 50, active: false });

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imgWrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoom({ x, y, active: true });
  };

  const handleImageMouseLeave = () => setZoom(prev => ({ ...prev, active: false }));
  const toggleZoomActive = () => setZoom(prev => ({ ...prev, active: !prev.active }));

  // Related products state (same category)
  const [related, setRelated] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState<boolean>(false);

  const currentCategoryId: string = useMemo(() => {
    const cat = currentProduct?.category;
    if (!cat) return "";
    if (typeof cat === "string") return cat; // id or name
    return cat._id || cat.id || cat.name || "";
  }, [currentProduct]);

  // Pretty category name/slug for routing to category page
  const currentCategoryParam: string = useMemo(() => {
    const cat = currentProduct?.category;
    if (!cat) return "";
    if (typeof cat === "string") return cat;
    return cat.slug || cat.name || "";
  }, [currentProduct]);

  // Determine top-level (root) category id for related products
  const [rootCategoryId, setRootCategoryId] = useState<string>("");

  useEffect(() => {
    const computeRootCategory = async () => {
      try {
        const res = await categoriesService.getAllCategories();
        const tree = (res as any)?.data || [];
        const flatten = (nodes: Category[], parentId?: string): Category[] => {
          const out: Category[] = [];
          for (const n of nodes) {
            out.push({ ...n, parentId });
            if (n.children && n.children.length) out.push(...flatten(n.children, n._id));
          }
          return out;
        };
        const flat: any[] = flatten(tree);
        const findNode = (idOrName: string) => flat.find(c => c._id === idOrName || c.slug === idOrName || c.name === idOrName);
        let node: any = findNode(String(currentCategoryId));
        if (!node && typeof currentProduct?.category === 'object') {
          const catObj: any = currentProduct.category;
          node = findNode(catObj._id || catObj.slug || catObj.name);
        }
        if (!node) return;
        while (node && node.parentId) {
          node = flat.find(c => c._id === node.parentId) || node;
          if (!node.parentId) break;
        }
        setRootCategoryId(node?._id || "");
      } catch (_) {
        setRootCategoryId(String(currentCategoryId || ""));
      }
    };
    computeRootCategory();
  }, [currentCategoryId, currentProduct]);

  useEffect(() => {
    const loadRelated = async () => {
      try {
        setLoadingRelated(true);
        const payload: ProductSearchPayload = {
          searchText: "",
          category: String(rootCategoryId || currentCategoryId || ""),
          nearby: false,
          page: 1,
          limit: 50,
        };
        const rows = await listProductsApi(payload);
        const all = Array.isArray(rows) ? rows.flatMap((r: any) => r.products || []) : [];
        const filtered = all.filter((p: any) => p._id !== currentProduct._id).slice(0, 5);
        setRelated(filtered);
      } catch (e) {
        setRelated([]);
      } finally {
        setLoadingRelated(false);
      }
    };
    loadRelated();
  }, [rootCategoryId, currentCategoryId, currentProduct?._id]);

  // Helper function to get proper image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;

    // Clean the path and ensure it doesn't have leading slashes
    const cleanPath = imagePath.replace(/^\/+/, '');

    // The backend stores images as 'uploads/filename.jpg', so we need to serve them from the root
    return `${import.meta.env.VITE_SERVER_URL || 'http://localhost:3003'}/${cleanPath}`;
  };

  const images = Array.isArray(currentProduct.image)
    ? currentProduct.image.map(getImageUrl)
    : [getImageUrl(currentProduct.image)];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate(`/products/category/${encodeURIComponent(currentCategoryParam)}`)}
          className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200 shadow-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Products
        </button>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Panel - Product Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
              <div
                ref={imgWrapperRef}
                className={`aspect-[4/3] relative ${zoom.active ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onMouseMove={handleImageMouseMove}
                onMouseLeave={handleImageMouseLeave}
                onClick={toggleZoomActive}
              >
                {/* Zoom toggle button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleZoomActive(); }}
                  className="absolute top-3 right-3 z-10 bg-white/80 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
                  aria-label={zoom.active ? 'Zoom out' : 'Zoom in'}
                >
                  {zoom.active ? (
                    <FiZoomOut className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                  ) : (
                    <FiZoomIn className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                  )}
                </button>
                <img
                  src={images[selectedImage] || images[0]}
                  alt={currentProduct.name}
                  className="w-full h-full object-contain p-4 select-none"
                  style={{
                    transform: zoom.active ? 'scale(3.2)' : 'scale(1)',
                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                    transition: zoom.active ? 'transform 60ms ease-out' : 'transform 150ms ease-out',
                  }}
                  draggable={false}
                />
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {images.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`${currentProduct.name} ${index + 1}`}
                      className="w-full h-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel - Product Info */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb {...currentProduct} />

            {/* Product Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {currentProduct.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full inline-block">
                {currentProduct.category?.name || currentProduct.category}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {currentProduct.discountPercent > 0 ? (
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-red-600">
                    AED {Math.max(0, Number(currentProduct.price) * (1 - (currentProduct.discountPercent || 0) / 100)).toFixed(0)}
                  </span>
                  <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                    AED {currentProduct.compareAtPrice || currentProduct.price}
                  </span>
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {currentProduct.discountPercent}% OFF
                  </span>
                </div>
              ) : (
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-red-600">
                    AED {currentProduct.price}
                  </span>
                  <span className="text-base text-gray-500 dark:text-gray-400">
                    ≈ USD {currentProduct.price}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Selector removed as requested */}

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="h-10 w-[140px]">
                <AddToCartButton size="sm" product={productAsCartItem} />
              </div>


              {/* Service Info */}
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  After payment, we will provide purchasing services for you from 09:00-18:00 (UTC+8)
                </p>
              </div>
            </div>

            {/* Product Variants */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Available Options</h3>
              <ProductVarients
                data={allVarients}
                onSelect={(e) => setItemIndex(e)}
              />
            </div>

            {/* Features */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Why shop from Bazaar?</h3>
              <div className="space-y-3">
                {allFeatures.map((feat, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <img className="w-8 h-8" src={feat.imgSrc} alt="" />
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">{feat.text}</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{feat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-16 grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Product Details</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentProduct.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Specifications</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Price:</span>
                    <span className="font-medium dark:text-gray-100">${currentProduct.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Quantity Available:</span>
                    <span className="font-medium dark:text-gray-100">{currentProduct.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Category:</span>
                    <span className="font-medium dark:text-gray-100">{currentProduct.category?.name || currentProduct.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Shipping & Returns</h2>

            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Free Shipping</h3>
                <p className="text-sm text-green-700 dark:text-green-200">
                  Free shipping nationwide, excluding some remote areas
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Return Policy</h3>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  You may return this item within 72 hours of buying it in case it is damaged or defective.
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Customer Care</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  Our customer service team is available to help with any questions or concerns.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Customer Reviews</h2>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 _section-card">
            <Review 
              productId={currentProduct._id} 
              currentUserId={getCurrentUserId() || undefined}
              onReviewSubmit={() => {
                // Refresh product data if needed
                console.log('Review submitted');
              }}
            />
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Related Products
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                More from {currentProduct.category?.name || "this category"}
              </p>
            </div>
            <Link
              to={`/products/category/${encodeURIComponent(currentCategoryParam)}`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              View All Products
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loadingRelated ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : related.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {related.map((p) => (
                <Link
                  key={p._id}
                  to={`/prn/${encodeURIComponent(p.name)}/prid/${p._id}`}
                  className="group block bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden mb-4 group-hover:shadow-lg transition-all duration-300">
                    <img
                      src={getImageUrl(Array.isArray(p.image) ? p.image[0] : p.image)}
                      alt={p.name}
                      className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-red-600">
                        ${p.price}
                      </p>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No related products found</p>
              <p className="text-gray-400 text-sm mt-1">Check back later for more products</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
