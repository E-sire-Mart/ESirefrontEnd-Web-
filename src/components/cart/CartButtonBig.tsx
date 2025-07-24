import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { setBillAmount, setTotalQuantity, setCartItems, setTotalAmount } from "../../store/cart";
import { CartItem, CartProduct } from "../../utils/types";
import { showCart } from "../../store/ui";
const CartButton = () => {
  const [isMobile, setIsMobile] = useState(false);
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
  const { totalQuantity, billAmount } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedCart = localStorage.getItem("cartProducts");
    if (storedCart) {
      const cartProducts = JSON.parse(storedCart);
      const totalQuantity = cartProducts.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0
      );
      const billAmount = cartProducts.reduce(
        (acc: number, item: any) => acc + item.newPrice * item.quantity,
        0
      );

      const totalAmount = cartProducts.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
      );

      let cartItems: CartItem[] = [];

      cartProducts.map((item: any) => {
        let cartItem: CartProduct = {
          title: item.title,
          image: item.image,
          price: item.price,
          id: item.id,
          subTitle: item.subTitle,
          newPrice: item.newPrice,
          mrp: item.mrp,
          shopId: item.shopId
        };

        cartItems.push({
          product: cartItem,
          quantity: item.quantity,
        });
      });

      dispatch(setCartItems(cartItems));
      dispatch(setTotalQuantity(totalQuantity));
      dispatch(setTotalAmount(totalAmount));
      dispatch(setBillAmount(billAmount));
    }
  }, []);

  return (
    <div
      style={{ display: isMobile ? "none" : "" }}
      className="fixed bottom-0 w-full flex flex-row justify-between items-center z-100 rounded-[6px] min-w-[112px] h-[50px] py-2 px-3 gap-2 font-bold text-sm bg-[#0c831f] cursor-pointer text-white"
      onClick={() => dispatch(showCart())}
    >
      <FaShoppingCart size={24} className="_wiggle" />
      <div className="flex flex-col font-bold text-[14px] leading-none">
        {totalQuantity === 0 ? (
          <span className="">My Cart</span>
        ) : (
          <>
            <span className="tracking-tight">{totalQuantity} items</span>
            <span className="tracking-tight mt-0.5">₹{billAmount}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default CartButton;
