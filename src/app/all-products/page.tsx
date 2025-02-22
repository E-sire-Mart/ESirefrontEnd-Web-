// src/app/all-products/page.tsx

import ProductCard from "../../Components/ProductCard";
import { fetchProducts } from "../../lib/api";

export default async function AllProductsPage() {
  const products = await fetchProducts();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
