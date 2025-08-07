import { useEffect } from 'react';
import { useCart } from '../../hooks/useCart';

interface CartSyncHandlerProps {
  isAuthenticated: boolean;
  onSyncComplete?: () => void;
}

const CartSyncHandler: React.FC<CartSyncHandlerProps> = ({ 
  isAuthenticated, 
  onSyncComplete 
}) => {
  const { syncLocalCart } = useCart();

  useEffect(() => {
    const handleCartSync = async () => {
      if (isAuthenticated) {
        try {
          await syncLocalCart();
          onSyncComplete?.();
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      }
    };

    handleCartSync();
  }, [isAuthenticated, syncLocalCart, onSyncComplete]);

  return null; // This component doesn't render anything
};

export default CartSyncHandler; 