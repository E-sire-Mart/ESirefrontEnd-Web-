import { useEffect, useMemo, useState } from "react";
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

// Build absolute URL for images
const getImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = (import.meta as any).env?.VITE_SERVER_URL || "http://localhost:3003";
  const normalized = String(path).replace(/\\/g, "/").replace(/^\/+/, "");
  const withUploads = normalized.startsWith("uploads/") ? normalized : `uploads/${normalized}`;
  return `${String(base).replace(/\/+$/, "")}/${withUploads}`;
};

// Compute aggregated counts (node + all descendants)
const buildAggregatedCounts = (roots: Category[], leafCounts: Record<string, number>): Record<string, number> => {
  const sums: Record<string, number> = {};

  const dfs = (node: Category): number => {
    const self = leafCounts[node._id] || 0;
    const kids = (node.children as Category[] | undefined) || [];
    let subtotal = self;
    for (const child of kids) subtotal += dfs(child);
    sums[node._id] = subtotal;
    return subtotal;
  };

  for (const r of roots) dfs(r);
  return sums;
};

// Sidebar tree node (click anywhere to expand/collapse and select)
const CategoryNode = ({
  node,
  selectedId,
  onSelect,
  expanded,
  onToggle,
  counts,
  level = 0,
}: {
  node: Category;
  selectedId: string | null;
  onSelect: (node: Category) => void;
  expanded: (id: string) => boolean;
  onToggle: (id: string) => void;
  counts: Record<string, number>;
  level?: number;
}) => {
  const hasChildren = (node.children?.length || 0) > 0;
  const isSelected = selectedId === node._id;
  const isOpen = expanded(node._id);

  const handleClick = () => {
    // Toggle if parent; always select
    if (hasChildren) onToggle(node._id);
    onSelect(node);
  };

  // Layout tuning
  const thumbSize = level === 0 ? 60 : 0; // bigger image for top-level
  const rowPaddingLeft = (level === 0 ? 16 : 16 + 60) + level * 16; // ensure children shift right of parent thumbnail

  const countValue = counts[node._id] || 0;

  return (
    <div>
      <div
        className={`category-button ${isSelected ? "active" : ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0.8rem 1rem",
          border: "none",
          borderBottom: "1px solid rgba(107,114,128,0.15)",
          backgroundColor: isSelected ? "var(--active-bg, #e8f5e9)" : "var(--sidebar-bg, #ffffff)",
          borderLeft: isSelected ? "4px solid #16a34a" : "4px solid transparent",
          cursor: "pointer",
          textAlign: "left",
          justifyContent: 'space-between',
          gap: 12,
          paddingLeft: `${rowPaddingLeft}px`,
          transition: 'background-color 120ms ease, border-color 120ms ease'
        }}
        onClick={handleClick}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          {node.image && level === 0 ? (
            <img
              src={getImageUrl(node.image) || ''}
              alt={node.name}
              style={{ width: thumbSize, height: thumbSize, borderRadius: 10, objectFit: 'cover', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
              onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
            />
          ) : null}
          {hasChildren && (
            <span style={{ color: '#6b7280', fontSize: 14 }}>{isOpen ? '▾' : '▸'}</span>
          )}
          <p className="font-normal" style={{flex:1, margin: 0, fontSize: level === 0 ? 16 : 15, color: 'var(--sidebar-text, #111827)'}}>{node.name}</p>
        </div>
        <span style={{ minWidth: 32, textAlign: 'center', fontSize: 12, color: 'var(--chip-fg, #0c4a6e)', background: 'var(--chip-bg, #e0f2fe)', borderRadius: 9999, padding: '2px 8px' }}>{countValue}</span>
      </div>
      {hasChildren && isOpen && (
        <div>
          {(node.children as Category[]).map((child) => (
            <CategoryNode
              key={child._id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              expanded={expanded}
              onToggle={onToggle}
              counts={counts}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ProductViewAllProps {
  searchText: string;
}

const ProductViewAll: React.FC<ProductViewAllProps> = ({ searchText }) => {
  const param = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("All");
  const [products, setProducts] = useState<any[]>([]);
  const [visible, setVisible] = useState<number>(30);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [counts, setCounts] = useState<Record<string, number>>({});

  const isExpanded = (id: string) => expandedIds.has(id);
  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Load full category tree and preselect by slug (route param). If no slug, default to All (no preselect)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await categoriesService.getAllCategories();
        if (res.success && res.data) {
          setCategoryTree(res.data);
          // collapsed by default (no expanded ids)
          const slug = param.category as string | undefined;
          const walk = (nodes: Category[]): Category | undefined => {
            for (const n of nodes) {
              if (slug && n.slug === slug) {
                return n;
              }
              if (n.children && n.children.length) {
                const found = walk(n.children as Category[]);
                if (found) return found;
              }
            }
            return undefined;
          };
          const preselect = walk(res.data);
          if (preselect) {
            setSelectedCategoryId(preselect._id);
            setSelectedCategoryName(preselect.name);
          } else {
            // No slug provided or not found: default to All
            setSelectedCategoryId(null);
            setSelectedCategoryName('All');
          }
        }
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param.category]);

  // Fetch counts by category (global; can adapt to shopId if needed)
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const base = (import.meta as any).env?.VITE_SERVER_URL || 'http://localhost:3003';
        const res = await fetch(`${String(base).replace(/\/+$/, '')}/api/v1/product/counts/by-category`);
        const json = await res.json();
        setCounts(json.counts || {});
      } catch (e) {
        console.error('Failed to load category counts', e);
      }
    };
    fetchCounts();
  }, []);

  // Aggregated counts memoized
  const aggregatedCounts = useMemo(() => buildAggregatedCounts(categoryTree, counts), [categoryTree, counts]);

  // Fetch products by selected category (includes descendants on backend)
  useEffect(() => {
    const fetchData = async () => {
      setProducts([]);
      setLoading(true);
      const data: ProductSearchPayload = {
        searchText: searchText,
        category: selectedCategoryId || "",
        nearby: false,
        page: 1,
        limit: 200,
      };

      try {
        const response = await listProductsApi(data);
        const newProducts = response.reduce((accumulator: any, shop: any) => {
          return accumulator.concat(shop.products || []);
        }, []);
        setProducts(newProducts);
        setVisible(30);
        if (newProducts.length > 0) {
          try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategoryId !== undefined) fetchData();
  }, [selectedCategoryId, searchText]);

  const handleSelect = (node: Category) => {
    // node._id may be empty for "All"
    setSelectedCategoryId(node?._id || null);
    setSelectedCategoryName(node?.name || 'All');
  };

  const roots = useMemo(() => categoryTree, [categoryTree]);
  const totalCount = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);

  return (
    <div className="product-view-all container border bg-white dark:bg-gray-900">
      <div
        className="category-bar"
        style={{
          width: "24%",
          borderRight: "1px solid var(--tw-prose-borders, #1f2937)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          scrollbarWidth: "none",
          background: 'var(--sidebar-bg, #ffffff)'
        }}
      >
        <div
          className={`category-button ${selectedCategoryId ? '' : 'active'}`}
          onClick={() => handleSelect({ _id: '' } as Category)}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0.9rem 1rem",
            borderBottom: "1px solid rgba(107,114,128,0.15)",
            backgroundColor: selectedCategoryId ? "var(--sidebar-bg, #ffffff)" : "var(--active-bg, #e8f5e9)",
            borderLeft: selectedCategoryId ? "4px solid transparent" : "4px solid #16a34a",
            cursor: "pointer",
            gap: 12,
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Local image for 'All' */}
            <img
              src={`/categories/0.webp`}
              alt="All"
              style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', background: 'var(--thumb-bg, #ffffff)', border: '1px solid var(--thumb-border, #e5e7eb)' }}
              onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
            />
            <p className="font-medium" style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--sidebar-text, #111827)', letterSpacing: '.2px' }}>All</p>
          </div>
          <span style={{ minWidth: 32, textAlign: 'center', fontSize: 12, color: 'var(--chip-fg, #0c4a6e)', background: 'var(--chip-bg, #e0f2fe)', borderRadius: 9999, padding: '2px 8px' }}>{totalCount}</span>
        </div>
        {roots.map((root) => (
          <CategoryNode
            key={root._id}
            node={root}
            selectedId={selectedCategoryId}
            onSelect={handleSelect}
            expanded={isExpanded}
            onToggle={toggleExpanded}
            counts={aggregatedCounts}
          />
        ))}
      </div>

      <div className="_container" style={{ width: "100%", backgroundColor: "var(--content-bg, #F4F6FB)" }}>
        <div className="w-full flex flex-row justify-between items-center py-3 px-4 border-b bg-white dark:bg-gray-800">
          <p className="font-medium text-[#333]" style={{ fontSize: 16, fontWeight: 700, color: 'var(--content-heading, #0f172a)', letterSpacing: '.25px' }}>{selectedCategoryName} · Total: {products.length} products</p>
        </div>
        <div className="_container" style={{ width: "100%", padding: 20, backgroundColor: "var(--content-bg, #F4F6FB)" }}>
          {loading ? (
            <Loader />
          ) : products.length > 0 ? (
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
                    style={{ background: '#0c831f', color: '#fff', borderRadius: 8, border: 'none', padding: '10px 16px', cursor: 'pointer' }}
                  >
                    View More
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ width: "100%", padding: 20, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Empty />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductViewAll;
