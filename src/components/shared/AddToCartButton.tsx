import React, { useEffect, useState } from "react";
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";
import { notification } from "antd";
import { useCart } from "../../hooks/useCart";
import { CartItem } from "../../utils/types";

type ButtonProps = {
  product: any;
  size?: "sm" | "lg";
};

const AddToCartButton = ({ product, size }: ButtonProps) => {
  const { cartItems, addToCart, removeFromCart, decreaseQuantity, loading } = useCart();
  const [itemCount, setItemCount] = useState<number>(0);

  useEffect(() => {
    const storedProduct = Object.values(cartItems).flat().find(
      (item: CartItem) => item.product.id === product.id
    );
  
    if (storedProduct) {
      setItemCount(storedProduct.quantity);
    } else {
      setItemCount(0);
    }
  }, [product.id, cartItems]);

  const handleAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!loading) {
      try {
        await addToCart(product);
        notification.success({
          message: "Added to Cart",
          description: `${product.title} has been added to your cart.`,
          placement: "topRight",
          duration: 2,
        });
      } catch (error) {
        notification.error({
          message: "Failed to Add",
          description: "Unable to add item to cart. Please try again.",
          placement: "topRight",
          duration: 3,
        });
      }
    }
  };

  const handleRemove = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!loading && itemCount > 0) {
      try {
        await decreaseQuantity(product.id, product.shopId);
        notification.success({
          message: "Quantity Updated",
          description: `Quantity of ${product.title} has been decreased.`,
          placement: "topRight",
          duration: 2,
        });
      } catch (error) {
        notification.error({
          message: "Failed to Update",
          description: "Unable to update item quantity. Please try again.",
          placement: "topRight",
          duration: 3,
        });
      }
    }
  };

  return itemCount > 0 ? (
    <div
      className={`flex h-full w-full justify-around rounded-lg uppercase font-bold text-sm bg-[#0c831f] cursor-pointer ${
        size === "lg" ? "text-lg" : "text-normal"
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <button
        onClick={handleRemove}
        type="button"
        className="flex items-center justify-center w-8"
        disabled={loading}
      >
        <IoRemoveSharp size={18} className="text-white" />
      </button>
      <span className="flex items-center justify-center text-white">
        {loading ? '...' : itemCount}
      </span>
      <button
        onClick={handleAdd}
        type="button"
        className="flex items-center justify-center w-8"
        disabled={loading}
      >
        <IoAddSharp size={14} className="text-white" />
      </button>
    </div>
  ) : (
    <button
      type="button"
      className={`_add_to_cart ${size === "lg" ? "text-md" : "text-sm"} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleAdd}
      disabled={loading}
    >
      {loading ? 'Adding...' : 'Add'}
    </button>
  );
};

export default AddToCartButton;
