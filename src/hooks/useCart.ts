import { useEffect, useCallback } from 'react';
import { notification } from 'antd';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { 
  addItem, 
  removeItem, 
  setCartItems, 
  setTotalQuantity, 
  setTotalAmount, 
  setBillAmount,
  clearError 
} from '../store/cart';
import {
  fetchCartFromBackend,
  addItemToBackendCart,
  updateBackendCartItem,
  removeItemFromBackendCart,
  clearBackendCart,
  syncLocalCartToBackend
} from '../store/cartThunks';
import { syncCartWithLocalStorage, loadCartFromLocalStorage, calculateCartTotals } from '../utils/cartUtils';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { cartItems, totalQuantity, billAmount, loading, error } = useAppSelector((state) => state.cart);
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };

  // Load cart on app initialization and when authentication state changes
  useEffect(() => {
    const initializeCart = async () => {
      console.log('Cart initialization - isAuthenticated:', isAuthenticated());
      
      if (isAuthenticated()) {
        // User is logged in, fetch cart from backend
        console.log('Fetching cart from backend...');
        try {
          await dispatch(fetchCartFromBackend()).unwrap();
          console.log('Successfully fetched cart from backend');
        } catch (error) {
          console.error('Failed to fetch cart from backend:', error);
          // Fallback to local cart if backend fails
          const localCart = loadCartFromLocalStorage();
          if (localCart) {
            const { totalQuantity, totalAmount, billAmount } = calculateCartTotals(localCart);
            dispatch(setCartItems(localCart));
            dispatch(setTotalQuantity(totalQuantity));
            dispatch(setTotalAmount(totalAmount));
            dispatch(setBillAmount(billAmount));
            console.log('Fallback to local cart');
          }
        }
      } else {
        // User is not logged in, load from localStorage
        console.log('Loading cart from localStorage...');
        const localCart = loadCartFromLocalStorage();
        if (localCart) {
          const { totalQuantity, totalAmount, billAmount } = calculateCartTotals(localCart);
          dispatch(setCartItems(localCart));
          dispatch(setTotalQuantity(totalQuantity));
          dispatch(setTotalAmount(totalAmount));
          dispatch(setBillAmount(billAmount));
          console.log('Loaded local cart:', localCart);
        } else {
          // No local cart, ensure Redux state is empty
          dispatch(setCartItems({}));
          dispatch(setTotalQuantity(0));
          dispatch(setTotalAmount(0));
          dispatch(setBillAmount(0));
          console.log('No local cart found, cleared Redux state');
        }
      }
    };

    initializeCart();
  }, [dispatch, isAuthenticated()]);

  // Add item to cart
  const addToCart = useCallback(async (product: any) => {
    if (isAuthenticated()) {
      // User is logged in, add to backend
      try {
        await dispatch(addItemToBackendCart({
          productId: product.id,
          quantity: 1,
          shopId: product.shopId
        })).unwrap();
      } catch (error) {
        console.error('Failed to add item to backend cart:', error);
        // Fallback to local cart
        dispatch(addItem(product));
        syncCartWithLocalStorage(cartItems);
      }
    } else {
      // User is not logged in, add to local cart
      dispatch(addItem(product));
      syncCartWithLocalStorage(cartItems);
    }
  }, [dispatch, cartItems]);

  // Remove item from cart (completely remove the item)
  const removeFromCart = useCallback(async (productId: string, shopId: string) => {
    if (isAuthenticated()) {
      // User is logged in, remove from backend
      try {
        await dispatch(removeItemFromBackendCart(productId)).unwrap();
      } catch (error) {
        console.error('Failed to remove item from backend cart:', error);
        // Fallback to local cart
        dispatch(removeItem({ id: productId, storeId: shopId }));
        syncCartWithLocalStorage(cartItems);
      }
    } else {
      // User is not logged in, remove from local cart
      dispatch(removeItem({ id: productId, storeId: shopId }));
      syncCartWithLocalStorage(cartItems);
    }
  }, [dispatch, cartItems]);

  // Decrease item quantity by 1
  const decreaseQuantity = useCallback(async (productId: string, shopId: string) => {
    if (isAuthenticated()) {
      // User is logged in, update in backend
      try {
        // Find current quantity
        const currentItem = Object.values(cartItems).flat().find(
          (item: any) => item.product.id === productId
        );
        
        if (currentItem && currentItem.quantity > 1) {
          await dispatch(updateBackendCartItem({ productId, quantity: currentItem.quantity - 1 })).unwrap();
        } else if (currentItem && currentItem.quantity === 1) {
          // If quantity is 1, remove the item completely
          await dispatch(removeItemFromBackendCart(productId)).unwrap();
        }
      } catch (error) {
        console.error('Failed to decrease item quantity in backend cart:', error);
        // Fallback to local cart
        dispatch(removeItem({ id: productId, storeId: shopId }));
        syncCartWithLocalStorage(cartItems);
      }
    } else {
      // User is not logged in, update in local cart
      dispatch(removeItem({ id: productId, storeId: shopId }));
      syncCartWithLocalStorage(cartItems);
    }
  }, [dispatch, cartItems]);

  // Update item quantity
  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (isAuthenticated()) {
      // User is logged in, update in backend
      try {
        await dispatch(updateBackendCartItem({ productId, quantity })).unwrap();
      } catch (error) {
        console.error('Failed to update item in backend cart:', error);
      }
    } else {
      // User is not logged in, update in local cart
      // This would need to be implemented based on your local cart structure
      console.warn('Quantity updates for local cart not implemented');
    }
  }, [dispatch]);

  // Clear cart
  const clearCart = useCallback(async () => {
    if (isAuthenticated()) {
      // User is logged in, clear backend cart
      try {
        await dispatch(clearBackendCart()).unwrap();
        notification.success({
          message: "Cart Cleared",
          description: "Your cart has been cleared successfully.",
          placement: "topRight",
          duration: 2,
        });
      } catch (error) {
        console.error('Failed to clear backend cart:', error);
        notification.error({
          message: "Failed to Clear Cart",
          description: "Unable to clear cart. Please try again.",
          placement: "topRight",
          duration: 3,
        });
      }
    } else {
      // User is not logged in, clear local cart
      dispatch(setCartItems({}));
      dispatch(setTotalQuantity(0));
      dispatch(setTotalAmount(0));
      dispatch(setBillAmount(0));
      localStorage.removeItem('cartProducts');
      notification.success({
        message: "Cart Cleared",
        description: "Your cart has been cleared successfully.",
        placement: "topRight",
        duration: 2,
      });
    }
  }, [dispatch]);

  // Sync local cart to backend (call this when user logs in)
  const syncLocalCart = useCallback(async () => {
    if (isAuthenticated()) {
      const localCart = loadCartFromLocalStorage();
      if (localCart && Object.keys(localCart).length > 0) {
        try {
          await dispatch(syncLocalCartToBackend(localCart)).unwrap();
          // Clear local cart after successful sync
          localStorage.removeItem('cartProducts');
          // Also clear the Redux state to force re-initialization from backend
          dispatch(setCartItems({}));
          dispatch(setTotalQuantity(0));
          dispatch(setTotalAmount(0));
          dispatch(setBillAmount(0));
          // Re-fetch cart from backend to ensure we have the latest data
          await dispatch(fetchCartFromBackend()).unwrap();
          notification.success({
            message: "Cart Synced",
            description: "Your local cart has been synced to your account.",
            placement: "topRight",
            duration: 2,
          });
        } catch (error) {
          console.error('Failed to sync local cart to backend:', error);
          notification.error({
            message: "Sync Failed",
            description: "Unable to sync cart. Your items are still saved locally.",
            placement: "topRight",
            duration: 3,
          });
        }
      }
    }
  }, [dispatch]);

  // Clear error
  const clearCartError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle logout - clear all cart data
  const handleLogout = useCallback(() => {
    console.log('Clearing cart data on logout...');
    // Clear all cart data
    dispatch(setCartItems({}));
    dispatch(setTotalQuantity(0));
    dispatch(setTotalAmount(0));
    dispatch(setBillAmount(0));
    localStorage.removeItem('cartProducts');
    console.log('Cart data cleared successfully');
  }, [dispatch]);

  return {
    cartItems,
    totalQuantity,
    billAmount,
    loading,
    error,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    syncLocalCart,
    clearCartError,
    handleLogout,
    isAuthenticated: isAuthenticated()
  };
}; 