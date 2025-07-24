import { notification, Spin, Tag, Modal } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { ComapnyDescription, CompanyName, razorpayKeyId, SERVER_URL } from "../../services/url";
import { orderCreate, verifyPaymentOnBackend } from "../../services/api/order";
import { hideCart } from "../../store/ui";
import { setBillAmount, setCartItems, setTotalQuantity } from "../../store/cart";
import { CartItem } from "../../utils/types";
import AddToCartButton from "../shared/AddToCartButton";
import Login from "../auth/Login";
import SignUp from "../auth/Signup";
import AddressSelection from "../addressSection";
import handing from "../../assets/handing.png";
import delivery from "../../assets/fast-delivery.png";
import gross from "../../assets/gross.png";
import { getLocation } from "../../services/globalfunctions";
import { setLoginStatus } from "../../store/status";

const CartPanelItem = (props: CartItem) => {
  const { image, title, price, newPrice } = props.product;
  return (
    <div className="flex p-4 gap-4 border-t _border-muted">
      <div>
        <div className="h-[72px] w-[72px] border rounded-[4px] overflow-hidden">
          <img
            src={`${SERVER_URL}/${image}`}
            alt=""
            className="h-full w-full"
          />
        </div>
      </div>
      <div className="text-left flex flex-col flex-1">
        <div className="_text-default text-[15px] leading-tight mb-2" style={{lineBreak: "anywhere"}}>
          {title}
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-[14px] _text-default">₹{newPrice}</span>
            {price-newPrice > 0 && <span
              className="text-[14px]"
              style={{
                textDecorationLine: "line-through",
                marginLeft: "5px",
              }}
            >
              ₹{price}
            </span>}
          </div>
          <div className="h-9 w-[90px]">
            <AddToCartButton product={props.product} />
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPanel = () => {
  const dispatch = useAppDispatch();
  const { totalQuantity, cartItems, billAmount } =
    useAppSelector((state) => state.cart);
  const { isLogin } = useAppSelector((state) => state.status);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState<boolean>(false);

  const [isProceedStatus, setProceedStatus] = useState<boolean>(false);
  const [addressData, setAddressData] = useState<any>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [lat, setLat] = useState<any>();
  const [lng, setLng] = useState<any>();


  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
    setIsSignUpModalOpen(false);
  };

  const toggleSignUpModal = () => {
    setIsSignUpModalOpen(!isSignUpModalOpen);
    setIsLoginModalOpen(false);
  };

  const switchToSignUpModal = () => {
    setIsLoginModalOpen(false);
    setIsSignUpModalOpen(true);
  };

  const switchToLoginModal = () => {
    setIsSignUpModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const clearCart = () => {
    localStorage.removeItem("cartProducts");

    dispatch(setCartItems([]));
    dispatch(setTotalQuantity(0));
    dispatch(setBillAmount(0));
  };

  const toggleAddressModal = () => {
    setIsAddressModalOpen(!isAddressModalOpen);
  };

  const handleAddressSelect = (address: string) => {
    setAddressData({ lat, lng, address });
    setIsAddressModalOpen(false);
  };

  const createOrders = async () => {
    if (!addressData) {
      getLocation()
        .then(({ longitude, latitude }: any) => {
          setLat(latitude);
          setLng(longitude);
          toggleAddressModal(); // Open address modal if address not set
        })
        .catch((error) => {
          console.error("Error getting location:", error);
          let errorMessage;
          switch (error.code) {
            case 1:
              errorMessage = "User denied Geolocation";
              break;
            case 2:
              errorMessage = "Position unavailable";
              break;
            case 3:
              errorMessage = "Timeout";
              break;
            default:
              errorMessage = "An unknown error occurred";
          }

          notification.error({
            message: errorMessage
          });
        });
      return;
    }

    setProceedStatus(true);
    const response = await orderCreate(shopTotals, addressData);
    setProceedStatus(false);
    if (response?.status === 401) {
      notification.error({
        message: "Proceed Failed, Please login again!"
      });
      localStorage.removeItem("user");
      dispatch(setLoginStatus(false));
      setProceedStatus(false);
      return;
    } else if (response?.status === 500) {
      notification.error({
        message: "Order Creation Failed"
      });
      notification.error({
        message: "Internal Server Error"
      });
    }

    clearCart();

    // const data = response?.data;
    
    // const options: any = {
    //   key: razorpayKeyId,
    //   amount: data.amount,
    //   currency: data.currency,
    //   name: CompanyName,
    //   description: ComapnyDescription,
    //   order_id: data.id,
    //   handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
    //     notification.success({
    //       message: "Payment Successful",
    //       description: `Your payment of ₹${data.amount / 100} has been successfully processed. Thank you for your purchase!`,
    //     });

    //     verifyPaymentOnBackend({...response, amount: data.amount, currency: data.currency, addressData: addressData})
    //       .then((result) => {
    //         console.log(result);

    //         
    //         notification.success({
    //           message: "Payment Verification Successful",
    //           description: "Your payment has been verified and your order is confirmed.",
    //         });
    //         setProceedStatus(false);
    //       })
    //       .catch((error) => {
    //         notification.error({
    //           message: "Payment Verification Failed",
    //           description: error?.response?.data?.message || "An error occurred during payment verification.",
    //         });
    //         setProceedStatus(false);
    //       });
    //   },
    //   prefill: {
    //     name: "Your Name",
    //     email: "Your email",
    //     contact: "Your Phone Number",
    //   },
    //   theme: {
    //     // color: "#61dafb",
    //     color: "#3399cc"
    //   },
    //   modal: {
    //     ondismiss: () => {
    //       notification.warning({
    //         message: "Payment Cancelled",
    //         description: "You closed the payment window. If this was a mistake, you can retry the payment.",
    //       });
    //       setProceedStatus(false);
    //     },
    //   },
    // };

    // const rzp = new window.Razorpay(options);

    // rzp.open();

    // rzp.on('payment.failed', (response: any) => {
    //   notification.error({
    //     message: "Payment Failed",
    //     description: `Payment failed due to: ${response.error.description}. Please try again or use another payment method.`,
    //   });
    // });
  };

  // Function to group cart items by shopId
  const groupItemsByShop = (items: { [key: string]: CartItem[] }) => {
    const groupedItems: { [key: string]: CartItem[] } = {};
    
    Object.keys(items).forEach((shopId) => {
      items[shopId].forEach((item) => {
        if (!groupedItems[item.product.shopId]) {
          groupedItems[item.product.shopId] = [];
        }
        groupedItems[item.product.shopId].push(item);
      });
    });

    return groupedItems;
  };

  // Calculate totals for each shop
  const calculateTotalsByShop = (groupedItems: { [key: string]: CartItem[] }) => {
    let overallTotal = 0; // Initialize overall total
  
    const shopTotals = Object.keys(groupedItems).map((shopId) => {
      const items = groupedItems[shopId];
      const total = items.reduce((sum, item) => sum + item.product.newPrice * item.quantity, 0);
      const totalOrigin = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const handlingCharge = 2; // Assuming a fixed handling charge
      const deliveryCharge = total > 100 ? 0 : 15; // Free delivery if total is above 100
      const savedPrice = totalOrigin - total;
  
      // Add the current shop's total to the overall total
      overallTotal += total + handlingCharge + deliveryCharge;
  
      return {
        shopId,
        items,
        total,
        savedPrice,
        grandTotal: total + handlingCharge + deliveryCharge,
        deliveryCharge,
        handlingCharge,
      };
    });
  
    return {
      shopTotals, // Return the array of shop totals
      overallTotal, // Return the overall total price across all shops
    };
  };

  const groupedItems = groupItemsByShop(cartItems);
  const totalsByShop = calculateTotalsByShop(groupedItems);
  const shopTotals = totalsByShop.shopTotals;
  const overallTotal = totalsByShop.overallTotal;

  return (
    <div className="fixed inset-0 h-screen w-screen z-50 overflow-hidden p-4">
      <div
        className="absolute z-10 inset-0 bg-black bg-opacity-[.65]"
        onClick={() => !isProceedStatus ? dispatch(hideCart()) : null}
      />
      <aside
        className="_drawer flex flex-col overflow-y-auto overflow-x-hidden"
      >
        <div className="sticky top-0 bg-white flex items-center justify-between p-4">
          <h2 className="font-extrabold text-2xl _text-default">My Cart</h2>
          <IoClose
            size={24}
            className="cursor-pointer"
            onClick={() => {!isProceedStatus ? dispatch(hideCart()) : null}}
          />
        </div>
        {totalQuantity === 0 && Object.keys(cartItems).length === 0 ? (
          <div className="flex-1 bg-white p-6">
            <div className="flex flex-col gap-3 justify-center items-center text-center">
              <img src="empty-cart.webp" alt="" className="h-36 w-36" />
              <h3 className="font-bold text-lg leading-tight">
                You don't have any items in your cart
              </h3>
              <p className="text-sm _text-default mb-2">
                Your favourite items are just a click away
              </p>
              <button
                type="button"
                onClick={() => dispatch(hideCart())}
                className="bg-[#0c831f] text-white rounded-[8px] px-4 py-3 leading-none text-[13px] font-medium cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1" style={{ padding: "15px" }}>
              <div className="space-y-3 my-3">
                <div
                  className="bg-white border-y _border-muted"
                  style={{
                    borderRadius: "5px",
                    boxShadow: "0.5px 0.1px 1px 1px #ede7e7",
                  }}
                >
                  
                  {shopTotals.length > 0 ? (
                    <>
                      <div className="divide-y-1">
                        {
                          shopTotals.map((shop) => (
                            <div key={shop.shopId}>
                              <div className="bg-white border-y _border-muted" style={{ borderRadius: "5px", boxShadow: "0.5px 0.1px 1px 1px #ede7e7" }}>
                                <div className="flex flex-col px-4 pt-5">
                                  <div className="flex justify-between _text-muted text-xs">
                                    <span>Shipment of {shop.items.length} items from shop {shop.shopId}</span>
                                  </div>
                                  <div className="text-sm _text-default font-bold mb-1">
                                    Bill Details for Shop {shop.shopId}
                                  </div>
                                </div>
                                <div className="divide-y-1">
                                  {shop.items.map((item) => (
                                    <CartPanelItem key={item.product.id} {...item} />
                                  ))}
                                </div>
                                <div className="px-4 text-xs space-y-2 py-2">
                                  <div className="flex items-start justify-between _text-default">
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <img
                                        src={gross}
                                        alt="gross"
                                        style={{ width: "18px", marginRight: "5px" }}
                                      />
                                      <span>Items total</span>
                                      {shop.savedPrice > 0 && <Tag
                                        style={{
                                          backgroundColor: '#EDF4FF',
                                          borderColor: '#f0f5ff',
                                          color: 'rgb(37, 111, 239)',
                                          fontSize: '10px',
                                          fontWeight: 'bold',
                                          borderRadius: '4px',
                                          marginLeft: '5px'
                                        }}
                                      >
                                        Saved ₹{shop.savedPrice}
                                      </Tag>}
                                    </div>
                                    <span>
                                        {shop.savedPrice > 0 &&  <span
                                          style={{
                                            textDecorationLine: "line-through",
                                            marginRight: "5px",
                                          }}
                                        >
                                          ₹{shop.total + shop.savedPrice}
                                        </span>}
                                      <span>₹{shop.total}</span>
                                    </span>
                                  </div>
                                  <div className="flex items-start justify-between _text-default">
                                    <p className="flex flex-col">
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "flex-start",
                                          alignItems: "center",
                                        }}
                                      >
                                        <img
                                          src={delivery}
                                          alt="delivery"
                                          style={{ width: "20px", marginRight: "5px" }}
                                        />
                                        <span>Delivery charge</span>
                                      </div>
                                    </p>
                                    {shop.deliveryCharge > 0 ? (
                                      <span>₹{shop.deliveryCharge}</span>
                                    ) : (
                                      <span>
                                        <span
                                          style={{
                                            textDecorationLine: "line-through",
                                            marginRight: "5px",
                                          }}
                                        >
                                          ₹15
                                        </span>
                                        <span
                                          className="text-[#0c831f]"
                                          style={{ fontSize: "13px" }}
                                        >
                                          Free
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-start justify-between _text-default">
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <img
                                        src={handing}
                                        alt="Handing charge"
                                        style={{ width: "17px", marginRight: "5px" }}
                                      />
                                      <span>Handling charge</span>
                                    </div>
                                    <span>₹{shop.handlingCharge}</span>
                                  </div>
                                  <div className="flex items-start justify-between text-[14px] text-black font-bold py-2">
                                    <span style={{ color: "#404040" }}>Grand total</span>
                                    <span>₹{shop.grandTotal}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                        <div
                          className="bg-white border-y _border-muted"
                          style={{
                            borderRadius: "5px",
                            boxShadow: "0.5px 0.1px 1px 1px #ede7e7",
                          }}
                        >
                          <div className="flex flex-col px-4 pt-2">
                            <p className="text-sm _text-default font-bold mb-1">
                              Delivery in some times
                            </p>
                            <span
                              style={{
                                fontSize: "13px",
                                fontWeight: "500",
                                fontStyle: "normal",
                                fontFamily: "Okra",
                                lineHeight: "15px",
                                paddingBottom: "12px",
                                color: "#828282",
                              }}
                            >
                              Orders cannot be cancelled once packed for delivery. In
                              case of unexpected delays, a refund will be provided, if
                              applicable.
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 bg-white p-6">
                      <div className="flex flex-col gap-3 justify-center items-center text-center">
                        <img src="empty-cart.webp" alt="" className="h-36 w-36" />
                        <h3 className="font-bold text-lg leading-tight">
                          You don't have any items in your cart
                        </h3>
                        <p className="text-sm _text-default mb-2">
                          Your favourite items are just a click away
                        </p>
                        <button
                          type="button"
                          onClick={() => dispatch(hideCart())}
                          className="bg-[#0c831f] text-white rounded-[8px] px-4 py-3 leading-none text-[13px] font-medium cursor-pointer"
                        >
                          Start Shopping
                        </button>
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>
            </div>
            <div
              className="sticky bottom-0 bg-white px-4 pt-2 pb-4 min-h-[68px] _shadow_sticky"
              onClick={() => {
                if (!isLogin) {
                  toggleLoginModal();
                } else {
                  createOrders();
                }
              }}
            >
              <div className="bg-[#0c831f] cursor-pointer text-white flex items-center px-3 py-3 rounded-[4px] font-medium text-[14px]">
                <div className="font-bold">{totalQuantity} Items</div>
                <div className="font-bold">&nbsp; &middot; &nbsp;</div>
                <div>
                  <span className="font-extrabold">
                    ₹{overallTotal}
                  </span>
                </div>
                <div className="ml-auto flex items-center font-bold">
                  {!isProceedStatus ? (
                    <>
                      {!isLogin ? "Login to " : null}Proceed
                    </>
                  ) : (
                    <Spin 
                      indicator={<LoadingOutlined spin />} 
                      style={{ marginRight: '15px', color: '#fff' }} 
                    />
                  )}
                  <FiChevronRight size={18} className="ml-2" />
                </div>
              </div>
            </div>

            <Modal
              // title="Your Address"
              visible={isAddressModalOpen}
              onCancel={toggleAddressModal}
              footer={null}
              centered
            >
              <AddressSelection onAddressSelect={handleAddressSelect} lat={lat} lng={lng}/>
            </Modal>
            {/* Render Login Modal */}
            {isLoginModalOpen && (
              <Login
                toggleLoginModal={toggleLoginModal}
                switchToSignupModal={switchToSignUpModal}
                switchToForgotPassModal={() => {}}
              />
            )}

            {/* Render Sign Up Modal */}
            {isSignUpModalOpen && (
              <SignUp
                toggleSignupModal={toggleSignUpModal}
                switchToLoginModal={switchToLoginModal}
              />
            )}
          </>
        )}
      </aside>
    </div>
  );
};

export default CartPanel;