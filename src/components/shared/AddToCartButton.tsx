import React, { useEffect, useState } from "react";
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { addItem, removeItem } from "../../store/cart";
import { CartProduct, CartItem } from "../../utils/types";

type ButtonProps = {
  product: CartProduct;
  size?: "sm" | "lg";
};

const AddToCartButton = ({ product, size }: ButtonProps) => {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  const [itemCount, setItemCount] = useState<number>(0);

  useEffect(() => {
    const storedProduct = Object.values(cartItems).flat().find(
      (item: CartItem) => item.product.id === product.id
    );
  
    if (storedProduct) {
      setItemCount(storedProduct.quantity);
    } else {
      setItemCount(0); // Reset to 0 if not found
    }
  }, [product.id, cartItems]);

  const updateCart = (action: "add" | "remove") => {
    const isAdding = action === "add";
    const newCount = isAdding ? itemCount + 1 : Math.max(itemCount - 1, 0);
    
    if (isAdding) {
      dispatch(addItem({ ...product }));
    } else {
      if (itemCount > 0) {
        dispatch(removeItem({ id: product.id, storeId: product.shopId }));
      }
    }

    setItemCount(newCount);

    const storedProducts = localStorage.getItem("cartProducts");
    let cartProducts: CartProduct[] = storedProducts ? JSON.parse(storedProducts) : [];

    const productIndex = cartProducts.findIndex(
      (item: CartProduct) => item.id === product.id
    );

    // if (isAdding) {
    //   if (productIndex !== -1) {
    //     cartProducts[productIndex].quantity += 1;
    //   } else {
    //     cartProducts.push({ ...product, quantity: 1 });
    //   }
    // } else {
    //   if (productIndex !== -1) {
    //     if (cartProducts[productIndex].quantity > 1) {
    //       cartProducts[productIndex].quantity -= 1;
    //     } else {
    //       cartProducts.splice(productIndex, 1); // Use splice for better performance
    //     }
    //   }
    // }

    // localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
  };

  const handleItemAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    updateCart("add");
  };

  return itemCount > 0 ? (
    <div
      className={`flex h-full w-full justify-around rounded-lg uppercase font-bold text-sm bg-[#0c831f] cursor-pointer ${
        size === "lg" ? "text-lg" : "text-normal"
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          updateCart("remove");
        }}
        type="button"
        className="flex items-center justify-center w-8"
      >
        <IoRemoveSharp size={18} className="text-white" />
      </button>
      <span className="flex items-center justify-center text-white">
        {itemCount}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          updateCart("add");
        }}
        type="button"
        className="flex items-center justify-center w-8"
      >
        <IoAddSharp size={18} className="text-white" />
      </button>
    </div>
  ) : (
    <button
      type="button"
      className={`_add_to_cart ${size === "lg" ? "text-md" : "text-sm"}`}
      onClick={(e) => handleItemAdd(e)}
    >
      Add
    </button>
  );
};

export default AddToCartButton;
