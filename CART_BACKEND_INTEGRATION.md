# Cart Backend Integration

This document explains how the cart system has been integrated with the backend API for registered users.

## Overview

The cart system now supports both local storage (for guest users) and backend persistence (for registered users). When a user is authenticated, all cart operations are performed against the backend API. When not authenticated, operations use local storage.

## Backend API Endpoints

The following endpoints are used for cart operations:

- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/cart/add` - Add item to cart
- `PUT /api/v1/cart/update` - Update cart item quantity
- `DELETE /api/v1/cart/remove` - Remove item from cart
- `DELETE /api/v1/cart/clear` - Clear entire cart
- `POST /api/v1/cart/sync` - Sync local cart to backend (when user registers)

## Frontend Implementation

### Key Files

1. **`src/services/cartService.ts`** - API service functions
2. **`src/store/cartThunks.ts`** - Redux async thunks for backend operations
3. **`src/store/cart.ts`** - Updated Redux store with async thunk support
4. **`src/hooks/useCart.ts`** - Custom hook for cart operations
5. **`src/components/auth/CartSyncHandler.tsx`** - Handles cart sync on login

### Authentication Check

The system checks for authentication using:
```typescript
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};
```

**Note**: You may need to adjust this based on your authentication implementation.

### Cart Operations Flow

1. **Add Item**: 
   - If authenticated → API call → Update Redux state
   - If not authenticated → Local Redux action → Update localStorage

2. **Remove Item**:
   - If authenticated → API call → Update Redux state
   - If not authenticated → Local Redux action → Update localStorage

3. **Load Cart**:
   - If authenticated → Fetch from API → Update Redux state
   - If not authenticated → Load from localStorage → Update Redux state

4. **Sync on Login**:
   - When user logs in → Sync local cart to backend → Clear local cart

## Usage

### In Components

```typescript
import { useCart } from '../hooks/useCart';

const MyComponent = () => {
  const { 
    cartItems, 
    totalQuantity, 
    billAmount, 
    loading, 
    error,
    addToCart, 
    removeFromCart,
    clearCart 
  } = useCart();

  const handleAddProduct = async (product) => {
    await addToCart(product);
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <div>Items: {totalQuantity}</div>
      <div>Total: ₹{billAmount}</div>
    </div>
  );
};
```

### Cart Sync on Login

Add the `CartSyncHandler` component to your app:

```typescript
import CartSyncHandler from './components/auth/CartSyncHandler';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div>
      {/* Your app content */}
      <CartSyncHandler 
        isAuthenticated={isAuthenticated}
        onSyncComplete={() => console.log('Cart synced!')}
      />
    </div>
  );
};
```

## Error Handling

The system includes comprehensive error handling:

- **API Failures**: Fallback to local storage operations
- **Network Errors**: Graceful degradation with user feedback
- **Invalid Data**: Automatic cleanup and validation

## Loading States

All cart operations show loading states:
- Buttons are disabled during operations
- Loading indicators are displayed
- Cart totals show "..." during updates

## Data Format

### Backend Response Format
```typescript
{
  success: boolean;
  cartItems: Array<{
    product: {
      id: string;
      title: string;
      image: string;
      price: number;
      newPrice: number;
      mrp: number;
      subTitle: string;
      shopId: string;
    };
    quantity: number;
  }>;
  totalQuantity: number;
  totalAmount: number;
  billAmount: number;
}
```

### Frontend Cart Structure
```typescript
{
  [shopId: string]: Array<{
    product: CartProduct;
    quantity: number;
  }>;
}
```

## Configuration

### API Base URL
Update `src/services/url.ts` to point to your backend:
```typescript
export const SERVER_URL = 'http://your-backend-url.com';
```

### Authentication Token
The system expects the authentication token to be stored in localStorage as 'token'. Adjust the `isAuthenticated` function in `useCart.ts` if you use a different storage method.

## Testing

1. **Guest User Flow**:
   - Add items to cart → Check localStorage
   - Remove items → Verify updates
   - Refresh page → Cart persists

2. **Authenticated User Flow**:
   - Login → Cart syncs to backend
   - Add/remove items → API calls made
   - Refresh page → Cart loads from backend

3. **Transition Flow**:
   - Add items as guest → Login → Items sync to backend
   - Logout → Cart clears (or persists based on your requirements)

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend allows requests from your frontend domain
2. **Authentication Errors**: Check token format and storage
3. **API Endpoint Mismatch**: Verify endpoint URLs match your backend
4. **Data Format Issues**: Ensure backend response matches expected format

### Debug Mode

Enable debug logging by adding to your environment:
```typescript
// In cartService.ts
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('API Request:', endpoint, options);
  console.log('API Response:', response);
}
```

## Future Enhancements

1. **Offline Support**: Queue operations when offline
2. **Real-time Updates**: WebSocket integration for multi-device sync
3. **Cart Sharing**: Share cart between users
4. **Cart Templates**: Save cart as template for future use 