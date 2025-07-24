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

const categories = [
  { name: "All", icon: "0.webp" },
  { name: "Fruits & Vegetables", icon: "1.avif" },
  { name: "Dairy, Bread & Eggs", icon: "2.avif" },
  { name: "Snacks & Munchies", icon: "3.avif" },
  { name: "Bakery & Biscuits", icon: "4.avif" },
  { name: "Breakfast & Instant Food", icon: "5.webp" },
  { name: "Tea, Coffee & Health Drink", icon: "6.avif" },
  { name: "Cold Drinks & Juices", icon: "7.avif" },
  { name: "Sweet Tooth", icon: "8.avif" },
  { name: "Atta, Rice & Dai", icon: "9.avif" },
  { name: "Masala, Oil & More", icon: "10.avif" },
  { name: "Sauces & Spreads", icon: "11.avif" },
  { name: "Chicken, Meat & Fish", icon: "12.avif" },
  { name: "Organic & Healthy Living", icon: "13.avif" },
  { name: "Paan Corner", icon: "14.avif" },
  { name: "Baby Care", icon: "15.avif" },
  { name: "Pharma & Wellness", icon: "16.webp" },
  { name: "Cleaning Essentials", icon: "17.avif" },
  { name: "Home & Office", icon: "18.webp" },
  { name: "Personal Care", icon: "19.webp" },
  { name: "Pet Care", icon: "20.avif" },
];

interface ProductViewAllProps {
  searchText: string;
}

const ProductViewAll: React.FC<ProductViewAllProps> = ({ searchText }) => {
  const param = useParams();
  const [shopId, setShopId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState(categories[0].name);
  const [products, setProducts] = useState<any[]>([]);
  const [shopName, setShopName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setProducts([]);
      setLoading(true);
      const data: ProductSearchPayload = {
        searchText: searchText,
        shopId: param.shopId,
        category: category,
        nearby: false,
        page: 1,
        limit: 50,
      };

      const response = await listProductsApi(data);
      console.log(response);

      setLoading(false);
      setProducts(response[0].products);
      setShopName(response[0].shopName);
    };

    fetchData();
  }, [category, searchText]);

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
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`category-button ${
                category === cat.name ? "active" : ""
              }`}
              onClick={() => setCategory(cat.name)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.75rem 1rem",
                border: "none",
                borderBottom: "1px solid #dddddd",
                backgroundColor: category === cat.name ? "#F0F8E7" : "white",
                borderLeft:
                  category === cat.name
                    ? "5px solid green"
                    : "5px solid transparent",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <img
                src={`/categories/${cat.icon}`}
                alt={cat.name}
                style={{
                  width: "50px",
                  height: "50px",
                  marginRight: "10px",
                }}
              />
              <p className="font-normal">{cat.name}</p>
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
            // display:'flex',
            // justifyContent:'center',
            // alignItems:'center',
            // flexDirection:'column'
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
                  Total: {products.length} products
                </p>
              </div>

              <div className="_container w-full flex justify-center p-2">
                <div className="flex flex-wrap gap-2 justify-center">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <ProductCard key={product.id} data={product} />
                    ))
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
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductViewAll;
