import { useEffect, useState } from "react";
import "./style.css"; // Assuming the styles are shared
import { useParams } from "react-router-dom";
import {
  listProductsApi,
  ProductSearchPayload,
} from "../../services/api/products";
import ProductCard from "../ProductCard";
import { Loader } from "../shared";
import { Empty } from "antd";
import { categoriesService, type Category } from "../../services/api/categories";

// Build absolute URL for images coming from backend (uploads/filename)
const getImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = (import.meta as any).env?.VITE_SERVER_URL || "http://localhost:3003";
  const normalized = String(path).replace(/\\/g, "/").replace(/^\/+/, "");
  const withUploads = normalized.startsWith("uploads/") ? normalized : `uploads/${normalized}`;
  return `${String(base).replace(/\/+$/, "")}/${withUploads}`;
};

interface ProductViewAllProps {
  searchText: string;
}

const ProductViewAll: React.FC<ProductViewAllProps> = ({ searchText }) => {
  const param = useParams();
  const [shopId, setShopId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [rootCategories, setRootCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("All");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<any[]>([]);
  const [visible, setVisible] = useState<number>(30);
  const [shopName, setShopName] = useState<string>("");

  // Load top-level (root) categories from backend
  useEffect(() => {
    const load = async () => {
      try {
        const res = await categoriesService.getRootCategories();
        if (res.success && res.data) {
          setRootCategories(res.data);
          // Do not preselect a category on initial load; show All products
          setSelectedCategoryId("");
          setSelectedCategoryName("All");
        }
      } catch (e) {
        console.error("Failed to load root categories", e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setProducts([]);
      setLoading(true);
      const data: ProductSearchPayload = {
        searchText: searchText,
        shopId: param.shopId,
        category: selectedCategoryId, // send category id to backend
        nearby: false,
        page: 1,
        limit: 50,
      };

      try {
        const response = await listProductsApi(data);
        setLoading(false);
        // Combine products from all shops when no specific shop/category is selected
        const combined = Array.isArray(response)
          ? response.flatMap((row: any) => row?.products || [])
          : [];
        setProducts(combined);
        setVisible(30);
        setShopName("");
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };

    if (selectedCategoryId !== undefined) fetchData();
  }, [selectedCategoryId, searchText, param.shopId]);

  // Fetch product counts per category for the selected shop (keys may be ids or names)
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const base = import.meta.env.VITE_SERVER_URL;
        const url = `${base}/api/v1/product/counts/by-category${param.shopId ? `?shopId=${param.shopId}` : ''}`;
        const res = await fetch(url);
        const json = await res.json();
        setCounts(json.counts || {});
      } catch (e) {
        console.error('Failed to load category counts', e);
      }
    };
    fetchCounts();
  }, [param.shopId]);

  useEffect(() => {
    setShopId(param.shopId || "");
  }, []);

  return (
    <div className="product-view container border relative">
      <div className="product-view-all border relative">
        <div
          className="category-bar"
          style={{
            width: "20%",
            borderRight: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          {rootCategories.map((cat) => (
            <button
              key={cat._id}
              className={`category-button ${selectedCategoryId === cat._id ? "active" : ""}`}
              onClick={() => {
                setSelectedCategoryId(cat._id);
                setSelectedCategoryName(cat.name);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.75rem 1rem",
                border: "none",
                borderBottom: "1px solid #dddddd",
                backgroundColor: selectedCategoryId === cat._id ? "#F0F8E7" : "white",
                borderLeft: selectedCategoryId === cat._id ? "5px solid green" : "5px solid transparent",
                cursor: "pointer",
                textAlign: "left",
                justifyContent: 'space-between'
              }}
            >
              <img
                src={getImageUrl(cat.image) || ''}
                alt={cat.name}
                style={{
                  width: "50px",
                  height: "50px",
                  marginRight: "10px",
                  borderRadius: 6,
                  objectFit: 'cover'
                }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <p className="font-normal" style={{flex:1}}>{cat.name}</p>
              <span
                style={{
                  background: '#e5f6eb',
                  color: '#0c831f',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  padding: '2px 8px',
                  marginLeft: '8px'
                }}
              >
                {counts[cat._id] || counts[cat.name] || 0}
              </span>
            </button>
          ))}
        </div>

        <div
          className="_container"
          style={{
            width: "100%",
            backgroundColor: "#F4F6FB",
            padding: 0,
            position: "relative",
          }}
        >
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="w-full flex flex-row justify-between items-center py-3 px-4 border-b bg-white">
                {shopId && (
                  <h1 className="text-[18px] font-medium text-[#333]">
                    Shop: {shopName}
                  </h1>
                )}
                <p className="font-medium text-[#333]">
                  {selectedCategoryName} · Total: {products.length} products
                </p>
              </div>

              <div className="_container w-full p-4">
                {products.length > 0 ? (
                  <>
                    <div className="product-grid">
                      {products.slice(0, visible).map((product) => (
                        <ProductCard key={product.id || product._id} data={product} />
                      ))}
                    </div>
                    {products.length > visible && (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                        <button
                          onClick={() => setVisible((v) => v + 30)}
                          style={{
                            background: '#0c831f', color: '#fff', border: 'none', borderRadius: 8,
                            padding: '10px 16px', cursor: 'pointer'
                          }}
                        >
                          View More
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      gap: "8px",
                      padding: "8px",
                      backgroundColor: "#F4F6FB",
                      flexWrap: "wrap",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Empty />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductViewAll;
