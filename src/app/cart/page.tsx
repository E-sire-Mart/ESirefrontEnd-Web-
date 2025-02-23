// src/app/cart/page.tsx
"use client";

import { useCart } from "@/context/cart-context";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  if (cart.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cart.map((item) => (
        <div key={item._id} className="flex justify-between border p-4 my-2 rounded">
          <div>
            <p className="font-semibold">{item.name}</p>
            <p>${item.price}</p>
          </div>
          <button
            className="bg-red-500 text-white p-2 rounded"
            onClick={() => removeFromCart(item._id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
