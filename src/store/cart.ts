import { createSlice } from "@reduxjs/toolkit";
import { CartItem, CartProduct } from "../utils/types";

type InitialState = {
  cartItems: { [key: string]: CartItem[] }; // Change to an object keyed by store ID
  totalQuantity: number;
  totalAmount: number;
  billAmount: number;
};

const initialState: InitialState = {
  cartItems: {},
  totalQuantity: 0,
  totalAmount: 0,
  billAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload as CartProduct;
      const storeId = newItem.shopId; // Use shopId from CartProduct

      // Initialize the store's cart if it doesn't exist
      if (!state.cartItems[storeId]) {
        state.cartItems[storeId] = [];
      }

      const existingItem = state.cartItems[storeId].find(
        (item) => item.product.id === newItem.id
      );

      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.cartItems[storeId].push({
          product: newItem,
          quantity: 1
        });
      }
      state.totalQuantity++;
      state.totalAmount = Object.values(state.cartItems).reduce(
        (total, items) =>
          total + items.reduce((subtotal, item) => subtotal + item.product.price * item.quantity, 0),
        0
      );

      state.billAmount = Object.values(state.cartItems).reduce(
        (total, items) =>
          total + items.reduce((subtotal, item) => subtotal + item.product.newPrice * item.quantity, 0),
        0
      );
    },
    removeItem: (state, action) => {
      const { id, storeId } = action.payload; // Expecting payload to contain both id and storeId
      const existingItem = state.cartItems[storeId]?.find(
        (item) => item.product.id === id
      );
      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.cartItems[storeId] = state.cartItems[storeId].filter(
            (item) => item.product.id !== id
          );
        } else {
          existingItem.quantity--;
        }
      }

      state.totalQuantity--;

      state.totalAmount = Object.values(state.cartItems).reduce(
        (total, items) =>
          total + items.reduce((subtotal, item) => subtotal + item.product.mrp * item.quantity, 0),
        0
      );

      state.billAmount = Object.values(state.cartItems).reduce(
        (total, items) =>
          total + items.reduce((subtotal, item) => subtotal + item.product.newPrice * item.quantity, 0),
        0
      );
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
    setTotalQuantity: (state, action) => {
      state.totalQuantity = action.payload;
    },
    setTotalAmount: (state, action) => {
      state.totalAmount = action.payload;
    },
    setBillAmount: (state, action) => {
      state.billAmount = action.payload;
    }
  },
});

export default cartSlice.reducer;
export const { addItem, removeItem, setTotalQuantity, setBillAmount, setCartItems, setTotalAmount } =
  cartSlice.actions;
