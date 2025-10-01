import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useCart } from "../../hooks/useCart";
import { showCart } from "../../store/ui";

const CartButton = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { totalQuantity, billAmount, loading } = useCart();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth > 767);
    };

    // Check the initial window width
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Format billAmount to avoid NaN display
  const formattedBillAmount = isNaN(billAmount) ? 0 : billAmount;

  return (
    <div
      style={{ display: isMobile ? "none" : "" }}
      className={`fixed bottom-0 w-full flex flex-row justify-between items-center z-100 rounded-[6px] min-w-[112px] h-[50px] py-2 px-3 gap-2 font-bold text-sm bg-[#0c831f] cursor-pointer text-white ${loading ? 'opacity-75' : ''}`}
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
