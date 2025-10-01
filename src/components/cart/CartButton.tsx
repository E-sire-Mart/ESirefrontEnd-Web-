import { FaShoppingCart } from 'react-icons/fa';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useCart } from '../../hooks/useCart';
import { showCart } from '../../store/ui';

const CartButton = () => {
  const { totalQuantity, billAmount, loading } = useCart();
  const dispatch = useAppDispatch();

  // Format billAmount to avoid NaN display
  const formattedBillAmount = isNaN(billAmount) ? 0 : billAmount;

  return (
    <div
      className={`flex items-center rounded-[6px] min-w-[112px] h-[50px] py-2 px-3 gap-2 font-bold text-sm bg-[#0c831f] cursor-pointer text-white ${loading ? 'opacity-75' : ''}`}
      onClick={() => !loading && dispatch(showCart())}
    >
      <FaShoppingCart size={24} className="_wiggle" />
      <div className="flex flex-col font-bold text-[14px] leading-none">
        {totalQuantity === 0 ? (
          <span className="">My Cart</span>
        ) : (
          <>
            <span className="tracking-tight">{loading ? '...' : totalQuantity} items</span>
            <span className="tracking-tight mt-0.5">${loading ? '...' : formattedBillAmount}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default CartButton;
