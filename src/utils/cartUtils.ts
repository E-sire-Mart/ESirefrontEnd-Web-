import { CartItem, CartProduct } from "./types";

// Helper function to safely parse numbers
export const safeNumber = (value: any, fallback: number = 0): number => {
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
};

// Helper function to calculate cart totals safely
export const calculateCartTotals = (cartItems: { [key: string]: CartItem[] }) => {
  let totalQuantity = 0;
  let totalAmount = 0;
  let billAmount = 0;

  Object.values(cartItems).forEach(items => {
    items.forEach(item => {
      const quantity = safeNumber(item.quantity, 0);
      const price = safeNumber(item.product.price, 0);
      const newPrice = safeNumber(item.product.newPrice, price); // Fallback to price if newPrice is invalid
      
      totalQuantity += quantity;
      totalAmount += price * quantity;
      billAmount += newPrice * quantity;
    });
  });

  return { 
    totalQuantity, 
    totalAmount, 
    billAmount: Math.round(billAmount * 100) / 100 // Round to 2 decimal places
  };
};

// Helper function to validate cart product data
export const validateCartProduct = (product: any): CartProduct => {
  return {
    title: product.title || "",
    image: product.image || "",
    price: safeNumber(product.price, 0),
    id: product.id || "",
    subTitle: product.subTitle || "",
    newPrice: safeNumber(product.newPrice, safeNumber(product.price, 0)),
    mrp: safeNumber(product.mrp, safeNumber(product.price, 0)),
    shopId: product.shopId || "default"
  };
};

// Helper function to sync cart with localStorage
export const syncCartWithLocalStorage = (cartItems: { [key: string]: CartItem[] }) => {
  try {
    const cartProductsForStorage = Object.values(cartItems).flat().map(item => ({
      ...item.product,
      quantity: item.quantity
    }));
    
    localStorage.setItem("cartProducts", JSON.stringify(cartProductsForStorage));
    return true;
  } catch (error) {
    console.error("Error syncing cart with localStorage:", error);
    return false;
  }
};

// Helper function to load cart from localStorage
export const loadCartFromLocalStorage = () => {
  try {
    const storedCart = localStorage.getItem("cartProducts");
    if (!storedCart) return null;

    const cartProducts = JSON.parse(storedCart);
    const cartItemsByStore: { [key: string]: CartItem[] } = {};

    cartProducts.forEach((item: any) => {
      const cartItem = validateCartProduct(item);
      
      if (!cartItemsByStore[cartItem.shopId]) {
        cartItemsByStore[cartItem.shopId] = [];
      }

      cartItemsByStore[cartItem.shopId].push({
        product: cartItem,
        quantity: safeNumber(item.quantity, 0),
      });
    });

    return cartItemsByStore;
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    localStorage.removeItem("cartProducts"); // Clear invalid data
    return null;
  }
}; 