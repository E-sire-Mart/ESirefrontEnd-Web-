// src/app/checkout/page.tsx
"use client";
import { useState } from "react";
import { useCart } from "../../context/cart-context";
import formatCurrency  from "../../lib/formatCurrency";

export default function CheckoutPage() {
  const { cart } = useCart();
  const [address, setAddress] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Checkout complete with address:", address);
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block">Shipping Address</label>
          <input
            type="text"
            value={address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <h2 className="text-xl">Order Summary</h2>
          <ul>
            {cart.map((item) => (
              <li key={item._id} className="flex justify-between">
                <span>{item.name}</span>
                <span>{formatCurrency(item.price)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4">
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
        </div>
        <button type="submit" className="p-2 bg-green-500 text-white rounded">
          Place Order
        </button>
      </form>
    </div>
  );
}
