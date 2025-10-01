import { useEffect, useMemo, useState } from "react";
import "./style.css";
import { categoriesService, type Category } from "../services/api/categories";
import { listProductsApi, type ProductSearchPayload } from "../services/api/products";
import { calculateDiscountedPrice, hasActiveDiscount } from "../utils/helper";

// Build absolute URL for images coming from backend (uploads/filename)
const getImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = (import.meta as any).env?.VITE_SERVER_URL || "http://localhost:3003";
  const normalized = String(path).replace(/\\/g, "/").replace(/^\/+/, "");
  // Ensure it has uploads/ prefix only once
  const withUploads = normalized.startsWith("uploads/") ? normalized : `uploads/${normalized}`;
  return `${String(base).replace(/\/+$/, "")}/${withUploads}`;
};

// Product card
const ProductCard = ({ product }: { product: any }) => {
  const firstImage = Array.isArray(product.image) ? product.image[0] : product.image;
  const isDiscountActive = hasActiveDiscount(product);
  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercent || 0);
  
  return (
    <div className="product-card" style={{ position: "relative" }}>
      {/* Discount Badge */}
      {product.discountPercent > 0 && (
        <div style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          background: "#ef4444",
          color: "white",
          padding: "4px 8px",
          borderRadius: "12px",
          fontSize: "10px",
          fontWeight: "bold",
          zIndex: 10
        }}>
          {product.discountPercent}% OFF
        </div>
      )}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img
          src={getImageUrl(firstImage)}
          alt={product.name}
          className="product-image"
          style={{ width: "150px", height: "150px", objectFit: "contain" }}
        />
      </div>
      <div className="product-details">
        <h4>{product.name}</h4>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {isDiscountActive ? (
              <div>
                <p style={{ color: "#e53e3e", fontWeight: "bold" }}>AED {discountedPrice.toFixed(0)}</p>
                <p style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: "12px" }}>
                  AED {product.price.toFixed(0)}
                </p>
                <span style={{ 
                  background: "#fef2f2", 
                  color: "#dc2626", 
                  padding: "2px 6px", 
                  borderRadius: "4px", 
                  fontSize: "10px",
                  fontWeight: "bold"
                }}>
                  {product.discountPercent}% OFF
                </span>
              </div>
            ) : (
              <p>AED {product.price.toFixed(0)}</p>
            )}
          </div>
          <button className="add-button">Add</button>
        </div>
      </div>
    </div>
  );
};

// Recursive category tree node
const CategoryNode = ({
  node,
  selectedId,
  onSelect,
  level = 0,
}: {
  node: Category;
  selectedId: string | null;
  onSelect: (id: string, node: Category) => void;
  level?: number;
}) => {
  const hasChildren = (node.children?.length || 0) > 0;
  const isSelected = selectedId === node._id;
  return (
    <div>
      <button
        className={isSelected ? "category-button active" : "category-button"}
        style={{
          width: "100%",
          textAlign: "left",
          border: "none",
          paddingLeft: `${level * 12 + 12}px`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
        onClick={() => onSelect(node._id, node)}
      >
        {node.image ? (
          <img src={getImageUrl(node.image)} alt={node.name} style={{ width: 24, height: 24, borderRadius: 4, objectFit: "cover" }} />
        ) : (
          <span style={{ width: 24, height: 24, borderRadius: 4, background: "#eef2ff", display: "inline-block" }} />
        )}
        <span>{node.name}</span>
      </button>
      {hasChildren && (
        <div>
          {node.children!.map((child) => (
            <CategoryNode key={child._id} node={child as Category} selectedId={selectedId} onSelect={onSelect} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

// Main ProductViewAll Component
const ProductViewAll: React.FC = () => {
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState<boolean>(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [visible, setVisible] = useState<number>(30);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  // Load categories tree from backend
  useEffect(() => {
    const loadCats = async () => {
      try {
        setLoadingCats(true);
        const res = await categoriesService.getAllCategories();
        if (res.success && res.data) {
          setCategoryTree(res.data);
          // Do not force-select a category on initial load; default to All
          setSelectedCategoryId(null);
          setSelectedCategory(null);
        }
      } catch (e) {
        console.error("Failed to fetch categories tree", e);
      } finally {
        setLoadingCats(false);
      }
    };
    loadCats();
  }, []);

  // Load products when category changes
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const payload: ProductSearchPayload = {
          searchText: "",
          shopId: "",
          category: selectedCategoryId || "",
          nearby: false,
          page: 1,
          limit: 40,
        };
        const rows = await listProductsApi(payload);
        const all = Array.isArray(rows) ? rows.flatMap((r: any) => r.products || []) : [];
        setProducts(all);
        setVisible(30);
      } catch (e) {
        console.error("Failed to fetch products by category", e);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    // Always load on mount and when category changes; backend will handle empty category as All
    loadProducts();
  }, [selectedCategoryId]);

  const handleSelect = (id: string, node: Category) => {
    setSelectedCategoryId(id);
    setSelectedCategory(node);
  };

  const flatRoot = useMemo(() => categoryTree, [categoryTree]);

  return (
    <div>
      <div className="product-view-all" style={{ paddingTop: "86px", paddingRight: "0", paddingLeft: "0" }}>
        <div className="category-bar" style={{ display: "flex", width: "100%", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
          <div style={{ width: 320 }}>
            {loadingCats ? (
              <div>Loading categories...</div>
            ) : (
              <div>
                {flatRoot.map((root) => (
                  <CategoryNode key={root._id} node={root} selectedId={selectedCategoryId} onSelect={handleSelect} />
                ))}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }} />
        </div>

        <div className="product-grid">
          {loadingProducts ? (
            <div style={{ padding: 16 }}>Loading products...</div>
          ) : products.length === 0 ? (
            <div style={{ padding: 16 }}>No products found for {selectedCategory?.name || "selected category"}</div>
          ) : (
            products.slice(0, visible).map((product, idx) => (
              <ProductCard key={product._id || idx} product={product} />
            ))
          )}
        </div>
        {!loadingProducts && products.length > visible && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
            <button
              onClick={() => setVisible((v) => v + 30)}
              style={{
                background: '#0c831f',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 16px',
                cursor: 'pointer'
              }}
            >
              View More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductViewAll;
