// src/app/wishlist/page.tsx

import { useWishlist } from "../../context/wishlist-context";
import ProductCard from "../../Components/ProductCard";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
