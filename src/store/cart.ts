import { createSlice } from "@reduxjs/toolkit";
import { CartItem, CartProduct } from "../utils/types";
import { calculateCartTotals, validateCartProduct } from "../utils/cartUtils";
import {
  fetchCartFromBackend,
  addItemToBackendCart,
  updateBackendCartItem,
  removeItemFromBackendCart,
  clearBackendCart,
  syncLocalCartToBackend
} from "./cartThunks";

type InitialState = {
  cartItems: { [key: string]: CartItem[] };
  totalQuantity: number;
  totalAmount: number;
  billAmount: number;
  loading: boolean;
  error: string | null;
};

const initialState: InitialState = {
  cartItems: {},
  totalQuantity: 0,
  totalAmount: 0,
  billAmount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = validateCartProduct(action.payload);
      const storeId = newItem.shopId;

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

      // Recalculate all totals using the utility function
      const { totalQuantity, totalAmount, billAmount } = calculateCartTotals(state.cartItems);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      state.billAmount = billAmount;
    },
    removeItem: (state, action) => {
      const { id, storeId } = action.payload;
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

      // Recalculate all totals using the utility function
      const { totalQuantity, totalAmount, billAmount } = calculateCartTotals(state.cartItems);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      state.billAmount = billAmount;
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      // Recalculate totals when cart items are set
      const { totalQuantity, totalAmount, billAmount } = calculateCartTotals(state.cartItems);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      state.billAmount = billAmount;
    },
    setTotalQuantity: (state, action) => {
      state.totalQuantity = action.payload;
    },
    setTotalAmount: (state, action) => {
      state.totalAmount = action.payload;
    },
    setBillAmount: (state, action) => {
      state.billAmount = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch cart from backend
    builder
      .addCase(fetchCartFromBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartFromBackend.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchCartFromBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      });

    // Add item to backend cart
    builder
      .addCase(addItemToBackendCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToBackendCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addItemToBackendCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add item to cart';
      });

    // Update backend cart item
    builder
      .addCase(updateBackendCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBackendCartItem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateBackendCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update cart item';
      });

    // Remove item from backend cart
    builder
      .addCase(removeItemFromBackendCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemFromBackendCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeItemFromBackendCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove item from cart';
      });

    // Clear backend cart
    builder
      .addCase(clearBackendCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearBackendCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(clearBackendCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to clear cart';
      });

    // Sync local cart to backend
    builder
      .addCase(syncLocalCartToBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncLocalCartToBackend.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(syncLocalCartToBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to sync cart';
      });
  }
});

export default cartSlice.reducer;
export const { 
  addItem, 
  removeItem, 
  setTotalQuantity, 
  setBillAmount, 
  setCartItems, 
  setTotalAmount,
  clearError,
  setLoading
} = cartSlice.actions;
