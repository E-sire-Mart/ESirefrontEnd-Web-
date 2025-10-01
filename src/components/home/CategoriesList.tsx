import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { categoriesService, Category } from "../../services/api/categories";

type Props = {};

// Fallback local categories data in case API fails
const fallbackCategories: Category[] = [
  { _id: '1', name: "Fruits & Vegetables", slug: "fruits-vegetables", image: "fruits-vegetables.jpg", isActive: true, sortOrder: 1, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '2', name: "Dairy, Bread & Eggs", slug: "dairy-bread-eggs", image: "dairy-bread-eggs.jpg", isActive: true, sortOrder: 2, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '3', name: "Snacks & Munchies", slug: "snacks-munchies", image: "snacks-munchies.jpg", isActive: true, sortOrder: 3, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '4', name: "Bakery & Biscuits", slug: "bakery-biscuits", image: "bakery-biscuits.jpg", isActive: true, sortOrder: 4, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '5', name: "Breakfast & Instant Food", slug: "breakfast-instant-food", image: "breakfast-instant-food.jpg", isActive: true, sortOrder: 5, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '6', name: "Tea, Coffee & Health Drink", slug: "tea-coffee-health-drink", image: "tea-coffee-health-drink.jpg", isActive: true, sortOrder: 6, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '7', name: "Cold Drinks & Juices", slug: "cold-drinks-juices", image: "cold-drinks-juices.jpg", isActive: true, sortOrder: 7, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '8', name: "Sweet Tooth", slug: "sweet-tooth", image: "sweet-tooth.jpg", isActive: true, sortOrder: 8, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '9', name: "Atta, Rice & Dal", slug: "atta-rice-dal", image: "atta-rice-dal.jpg", isActive: true, sortOrder: 9, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '10', name: "Masala, Oil & More", slug: "masala-oil-more", image: "masala-oil-more.jpg", isActive: true, sortOrder: 10, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '11', name: "Sauces & Spreads", slug: "sauces-spreads", image: "sauces-spreads.jpg", isActive: true, sortOrder: 11, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '12', name: "Chicken, Meat & Fish", slug: "chicken-meat-fish", image: "chicken-meat-fish.jpg", isActive: true, sortOrder: 12, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '13', name: "Organic & Healthy Living", slug: "organic-healthy-living", image: "organic-healthy-living.jpg", isActive: true, sortOrder: 13, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '14', name: "Paan Corner", slug: "paan-corner", image: "paan-corner.jpg", isActive: true, sortOrder: 14, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '15', name: "Baby Care", slug: "baby-care", image: "baby-care.jpg", isActive: true, sortOrder: 15, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '16', name: "Pharma & Wellness", slug: "pharma-wellness", image: "pharma-wellness.jpg", isActive: true, sortOrder: 16, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '17', name: "Cleaning Essentials", slug: "cleaning-essentials", image: "cleaning-essentials.jpg", isActive: true, sortOrder: 17, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '18', name: "Home & Office", slug: "home-office", image: "home-office.jpg", isActive: true, sortOrder: 18, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '19', name: "Personal Care", slug: "personal-care", image: "personal-care.jpg", isActive: true, sortOrder: 19, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '20', name: "Pet Care", slug: "pet-care", image: "pet-care.jpg", isActive: true, sortOrder: 20, level: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const CategoriesList = (props: Props) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('🔄 Starting to fetch categories from backend...');
        
        const response = await categoriesService.getRootCategories();
        console.log('🔄 Backend response:', response);
        
        if (response.success && response.data) {
          console.log('✅ Successfully fetched categories:', response.data);
          setCategories(response.data);
          setUsingFallback(false);
        } else {
          console.log('❌ Backend response not successful:', response);
          throw new Error(response.message || 'Failed to fetch categories');
        }
      } catch (err) {
        console.error('❌ Error fetching categories from API, using fallback data:', err);
        setCategories(fallbackCategories);
        setUsingFallback(true);
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleClick = (categoryName: string) => {
    navigate({
      pathname: `/products/category/${categoryName}`
    });    
  };

  if (loading) {
    return (
      <section className="my-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Shop by Category</h2>
          <p className="text-gray-600">Explore our wide range of products organized by category</p>
          {usingFallback && (
            <p className="text-sm text-amber-600 mt-2">
              ⚠️ Showing cached categories (backend connection unavailable)
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
          {Array.from({ length: 18 }).map((_, index) => (
            <div
              key={index}
              className="group rounded-xl bg-white/95 backdrop-blur-sm p-4 border border-gray-100 shadow-sm animate-pulse flex flex-col items-center justify-center"
            >
              <div className="h-28 sm:h-36 w-full bg-gray-200 rounded mb-3"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Shop by Category</h2>
          <p className="text-gray-600">Explore our wide range of products organized by category</p>
          {usingFallback && (
            <p className="text-sm text-amber-600 mt-2">
              ⚠️ Showing cached categories (backend connection unavailable)
            </p>
          )}
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="my-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Shop by Category</h2>
        <p className="text-gray-600">Explore our wide range of products organized by category</p>
        {usingFallback && (
          <p className="text-sm text-amber-600 mt-2">
            ⚠️ Showing cached categories (backend connection unavailable)
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
        {categories.map((category, index) => (
          <div
            key={category._id}
            className="group cursor-pointer rounded-xl bg-white/95 backdrop-blur-sm p-4 border border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center"
            onClick={() => handleClick(category.name)}
          >
            <div className="h-28 sm:h-36 w-full flex items-center justify-center mb-3">
              {category.image ? (
                <img
                  src={`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3003'}/uploads/${category.image}`}
                  className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  alt={category.name}
                  onLoad={() => {
                    console.log(`✅ Image loaded successfully: ${category.name} - ${import.meta.env.VITE_SERVER_URL || 'http://localhost:3003'}/uploads/${category.image}`);
                  }}
                  onError={(e) => {
                    console.log(`❌ Image failed to load: ${category.name} - ${import.meta.env.VITE_SERVER_URL || 'http://localhost:3003'}/uploads/${category.image}`);
                    // If image fails to load, show fallback
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded p-2 ${category.image ? 'hidden' : ''}`}
                style={{ display: category.image ? 'none' : 'flex' }}
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>
            {/* Category name - always visible below the image */}
            <div className="text-center">
              <span className="text-gray-800 text-sm font-medium leading-tight">{category.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesList;
