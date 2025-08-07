import { SERVER_URL } from './url';

// Types for API responses
interface CartApiResponse {
  success: boolean;
  message?: string;
  cartItems?: any[];
  totalQuantity?: number;
  totalAmount?: number;
  billAmount?: number;
}

interface CartItem {
  productId: string;
  quantity: number;
  shopId?: string;
}

// Helper function to make authenticated API calls
const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token'); // Adjust based on your auth token storage
  
  const response = await fetch(`${SERVER_URL}/api/v1/cart${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
    credentials: 'include', // Include cookies if using session-based auth
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Get user's cart from backend
export const getCart = async (): Promise<CartApiResponse> => {
  try {
    return await makeAuthenticatedRequest('/');
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (productId: string, quantity: number = 1, shopId?: string): Promise<CartApiResponse> => {
  try {
    return await makeAuthenticatedRequest('/add', {
      method: 'POST',
      body: JSON.stringify({
        productId,
        quantity,
        shopId
      }),
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItem = async (productId: string, quantity: number): Promise<CartApiResponse> => {
  try {
    return await makeAuthenticatedRequest('/update', {
      method: 'PUT',
      body: JSON.stringify({
        productId,
        quantity
      }),
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (productId: string): Promise<CartApiResponse> => {
  try {
    return await makeAuthenticatedRequest('/remove', {
      method: 'DELETE',
      body: JSON.stringify({
        productId
      }),
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// Clear entire cart
export const clearCart = async (): Promise<CartApiResponse> => {
  try {
    return await makeAuthenticatedRequest('/clear', {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Sync local cart to backend (when user registers/logs in)
export const syncLocalCart = async (items: CartItem[]): Promise<CartApiResponse> => {
  try {
    return await makeAuthenticatedRequest('/sync', {
      method: 'POST',
      body: JSON.stringify({
        items
      }),
    });
  } catch (error) {
    console.error('Error syncing cart:', error);
    throw error;
  }
}; 