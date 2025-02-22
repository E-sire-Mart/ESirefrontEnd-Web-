// src/components/ProductCard.tsx

import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, description, price }) => {
  return (
    <div className="border p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="mt-2 text-sm">{description}</p>
      <p className="mt-2 text-lg font-semibold">${price}</p>
      <Link href={`/product/${id}`} className="mt-4 inline-block text-blue-500 hover:underline">
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
