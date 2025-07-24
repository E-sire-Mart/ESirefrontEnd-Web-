"use client";

import { useEffect, useState } from "react";
import {
  CategoriesList,
  DiscountOffers,
  FeaturedPromo,
  HeroArea,
  HighlightedPromo,
  ProductsRow,
} from "../components/home";
import {
  listProductsApi,
  ProductSearchPayload,
} from "../services/api/products.js";
import { ProductRow } from "../utils/types";

const Home = ({searchText}: any) => {

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data: ProductSearchPayload = {
        searchText: searchText,
        shopId: "",
        category: "",
        nearby: false,
        page: 1,
        limit: 50,
      };
      try {
        const response = await listProductsApi(data); // Await the promise
        
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts(); // Call the async function to fetch products
  }, [searchText]);

  return (
    <div className="_container" style={{overflowX:'hidden'}}>
      <HeroArea />
      <FeaturedPromo />
      <CategoriesList />
      {/* <DiscountOffers /> */}
      <HighlightedPromo />
      {products.map((shopProduct: ProductRow, i) => (
        <ProductsRow
          key={i}
          shopName={shopProduct.shopName}
          shopId={shopProduct.shopId}
          products={shopProduct.products}
        />
      ))}
    </div>
  );
};

export default Home;
