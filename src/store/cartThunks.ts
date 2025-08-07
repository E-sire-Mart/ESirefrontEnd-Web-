import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart, 
  syncLocalCart 
} from '../services/cartService';
import { 
  setCartItems, 
  setTotalQuantity, 
  setTotalAmount, 
  setBillAmount 
} from './cart';
import { CartItem } from '../utils/types';

// Thunk to fetch cart from backend
export const fetchCartFromBackend = createAsyncThunk(
  'cart/fetchFromBackend',
  async (_, { dispatch }) => {
    try {
      const response = await getCart();
      
      if (response.success) {
        // Convert backend format to frontend format
        const cartItemsByStore: { [key: string]: CartItem[] } = {};
        
        response.cartItems?.forEach((item: any) => {
          const shopId = item.product.shopId || 'default';
          
          if (!cartItemsByStore[shopId]) {
            cartItemsByStore[shopId] = [];
          }
          
          cartItemsByStore[shopId].push({
            product: item.product,
            quantity: item.quantity
          });
        });

        dispatch(setCartItems(cartItemsByStore));
        dispatch(setTotalQuantity(response.totalQuantity || 0));
        dispatch(setTotalAmount(response.totalAmount || 0));
        dispatch(setBillAmount(response.billAmount || 0));
        
        return response;
      } else {
        throw new Error(response.message || 'Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart from backend:', error);
      throw error;
    }
  }
);

// Thunk to add item to cart
export const addItemToBackendCart = createAsyncThunk(
  'cart/addToBackend',
  async ({ productId, quantity = 1, shopId }: { productId: string; quantity?: number; shopId?: string }, { dispatch }) => {
    try {
      const response = await addToCart(productId, quantity, shopId);
      
      if (response.success) {
        // Convert backend format to frontend format
        const cartItemsByStore: { [key: string]: CartItem[] } = {};
        
        response.cartItems?.forEach((item: any) => {
          const itemShopId = item.product.shopId || 'default';
          
          if (!cartItemsByStore[itemShopId]) {
            cartItemsByStore[itemShopId] = [];
          }
          
          cartItemsByStore[itemShopId].push({
            product: item.product,
            quantity: item.quantity
          });
        });

        dispatch(setCartItems(cartItemsByStore));
        dispatch(setTotalQuantity(response.totalQuantity || 0));
        dispatch(setTotalAmount(response.totalAmount || 0));
        dispatch(setBillAmount(response.billAmount || 0));
        
        return response;
      } else {
        throw new Error(response.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to backend cart:', error);
      throw error;
    }
  }
);

// Thunk to update cart item quantity
export const updateBackendCartItem = createAsyncThunk(
  'cart/updateBackendItem',
  async ({ productId, quantity }: { productId: string; quantity: number }, { dispatch }) => {
    try {
      const response = await updateCartItem(productId, quantity);
      
      if (response.success) {
        // Convert backend format to frontend format
        const cartItemsByStore: { [key: string]: CartItem[] } = {};
        
        response.cartItems?.forEach((item: any) => {
          const shopId = item.product.shopId || 'default';
          
          if (!cartItemsByStore[shopId]) {
            cartItemsByStore[shopId] = [];
          }
          
          cartItemsByStore[shopId].push({
            product: item.product,
            quantity: item.quantity
          });
        });

        dispatch(setCartItems(cartItemsByStore));
        dispatch(setTotalQuantity(response.totalQuantity || 0));
        dispatch(setTotalAmount(response.totalAmount || 0));
        dispatch(setBillAmount(response.billAmount || 0));
        
        return response;
      } else {
        throw new Error(response.message || 'Failed to update cart item');
      }
    } catch (error) {
      console.error('Error updating backend cart item:', error);
      throw error;
    }
  }
);

// Thunk to remove item from cart
export const removeItemFromBackendCart = createAsyncThunk(
  'cart/removeFromBackend',
  async (productId: string, { dispatch }) => {
    try {
      const response = await removeFromCart(productId);
      
      if (response.success) {
        // Convert backend format to frontend format
        const cartItemsByStore: { [key: string]: CartItem[] } = {};
        
        response.cartItems?.forEach((item: any) => {
          const shopId = item.product.shopId || 'default';
          
          if (!cartItemsByStore[shopId]) {
            cartItemsByStore[shopId] = [];
          }
          
          cartItemsByStore[shopId].push({
            product: item.product,
            quantity: item.quantity
          });
        });

        dispatch(setCartItems(cartItemsByStore));
        dispatch(setTotalQuantity(response.totalQuantity || 0));
        dispatch(setTotalAmount(response.totalAmount || 0));
        dispatch(setBillAmount(response.billAmount || 0));
        
        return response;
      } else {
        throw new Error(response.message || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item from backend cart:', error);
      throw error;
    }
  }
);

// Thunk to clear cart
export const clearBackendCart = createAsyncThunk(
  'cart/clearBackend',
  async (_, { dispatch }) => {
    try {
      const response = await clearCart();
      
      if (response.success) {
        dispatch(setCartItems({}));
        dispatch(setTotalQuantity(0));
        dispatch(setTotalAmount(0));
        dispatch(setBillAmount(0));
        
        return response;
      } else {
        throw new Error(response.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing backend cart:', error);
      throw error;
    }
  }
);

// Thunk to sync local cart to backend
export const syncLocalCartToBackend = createAsyncThunk(
  'cart/syncToBackend',
  async (localCartItems: { [key: string]: CartItem[] }, { dispatch }) => {
    try {
      // Convert frontend format to backend format
      const itemsForBackend = Object.values(localCartItems).flat().map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        shopId: item.product.shopId
      }));

      const response = await syncLocalCart(itemsForBackend);
      
      if (response.success) {
        // Convert backend format to frontend format
        const cartItemsByStore: { [key: string]: CartItem[] } = {};
        
        response.cartItems?.forEach((item: any) => {
          const shopId = item.product.shopId || 'default';
          
          if (!cartItemsByStore[shopId]) {
            cartItemsByStore[shopId] = [];
          }
          
          cartItemsByStore[shopId].push({
            product: item.product,
            quantity: item.quantity
          });
        });

        dispatch(setCartItems(cartItemsByStore));
        dispatch(setTotalQuantity(response.totalQuantity || 0));
        dispatch(setTotalAmount(response.totalAmount || 0));
        dispatch(setBillAmount(response.billAmount || 0));
        
        return response;
      } else {
        throw new Error(response.message || 'Failed to sync cart');
      }
    } catch (error) {
      console.error('Error syncing local cart to backend:', error);
      throw error;
    }
  }
); 