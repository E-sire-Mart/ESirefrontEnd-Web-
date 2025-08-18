import React, { useEffect, useState } from "react";
import {
  BorderOuterOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import image from "../../assets/logo.png";
import { CartButton } from "../cart";
import LocationPicker from "../LocationPicker";
import SearchBox from "../SearchBox";
import Login from "../auth/Login";
import SignUp from "../auth/Signup";
import Order from "./Order";
import ForgotPassword from "../auth/ForgotPass";
import "./style.css";
import "./style1.css";
import { setLoginStatus } from "../../store/status";
import { setCartItems, setTotalQuantity, setTotalAmount, setBillAmount } from "../../store/cart";
import { useCart } from "../../hooks/useCart";

const Header = ({ onSearch }: any) => {
  const dispatch = useAppDispatch();
  const isLogin = useAppSelector((state) => state.status.isLogin);
  const { handleLogout: clearCart } = useCart();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setISForgotPasswordModalOpen] =
    useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      dispatch(setLoginStatus(true));
    }
  }, []);

  const toggleOrderModal = () => {
    setIsOrderModalOpen(!isOrderModalOpen);
  };

  const toggleSignupModal = () => {
    setIsSignUpModalOpen((prevState) => !prevState);
  };

  const toggleLoginModal = () => {
    setIsLoginModalOpen((prevState) => !prevState);
  };

  const toogleForgotPasswordModal = () => {
    setISForgotPasswordModalOpen((prevState) => !prevState);
  };

  const switchToLoginModal = () => {
    setIsSignUpModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const switchToSignupModal = () => {
    setIsLoginModalOpen(false);
    setIsSignUpModalOpen(true);
  };

  const switchToForgotPassModal = () => {
    toogleForgotPasswordModal();
    toggleLoginModal();
  };

  const handleLogout = () => {
    notification.success({
      message: "Log-out successfully",
    });
    
    // Clear all authentication data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Clear cart data using the cart hook
    clearCart();
    
    // Reset login status
    dispatch(setLoginStatus(false));
    
    navigate('/'); // Redirect to home page
  };

  return (
    <>
      <header className="_nav px-3 sm:px-6 lg:px-8 z-30 bg-white shadow-sm border-b border-gray-100">
        <div className="_header sm:flex h-full max-w-7xl mx-auto">
          <div className="hidden sm:flex max-w-[200px] md:max-w-[250px] w-full cursor-pointer sm:hover:bg-gray-50 items-center justify-center border-r _border-light px-4">
            <Link to={"/"}>
              <span className="font-black text-[32px] md:text-[38px] text-yellow-400 tracking-tight flex justify-center items-center px-6">
                <img src={image} alt="logo" style={{ width: "200px" }} />
              </span>
            </Link>
          </div>
          <div className="w-full sm:w-[240px] xl:w-[320px] py-3 px-3 sm:px-6 _header_loc flex items-center sm:justify-center cursor-pointer sm:hover:bg-gray-50">
            <LocationPicker />
          </div>
          <div className="flex-1 relative _header_search px-3 sm:px-6 mr-0 sm:mr-6">
            <SearchBox onSearch={onSearch} />
          </div>
          <div className="flex items-center _header_login justify-center cursor-pointer sm:hover:bg-gray-50 max-w-[120px] w-full group px-3">
            <span className="font-medium _text-default block">
              {isLogin ? (
                <div className="flex justify-center items-center relative">
                  <div className="rounded-full flex justify-center items-center bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <HomeOutlined className="text-[20px] p-2" />
                  </div>
                  <div className="signin-card hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 z-50 min-w-[180px]">
                    <ul>
                      <li className="hover:bg-red-500 rounded p-2 transition-colors duration-200">
                        <p className="p-[5px]">
                          <Link
                            to="/profile"
                            className="text-black flex items-center"
                          >
                            <UserOutlined className="mr-1" />
                            My Profile
                          </Link>
                        </p>
                      </li>
                      <li className="hover:bg-red-500 rounded p-2 transition-colors duration-200">
                        <p className="p-[5px]">
                          <a
                            href="#"
                            onClick={toggleOrderModal}
                            className="text-black"
                          >
                            <BorderOuterOutlined className="mr-1" />
                            My Orders
                          </a>
                        </p>
                      </li>
                      <li
                        onClick={handleLogout}
                        className="hover:bg-red-500 rounded p-2 transition-colors duration-200 group"
                      >
                        <p className="flex items-center text-black p-[5px] transition-colors duration-200">
                          <LogoutOutlined className="mr-1" />
                          Logout
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex items-center" onClick={toggleLoginModal}>
                  <LoginOutlined className="mr-1 text-[20px]" />
                  Login
                </div>
              )}
            </span>
          </div>
          <div className="py-2 hidden md:flex h-full items-center mr-2 sm:mr-4 ml-1 sm:ml-3 px-3 sm:px-4">
            <CartButton />
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div key="login">
          <Login
            switchToSignupModal={switchToSignupModal}
            toggleLoginModal={toggleLoginModal}
            switchToForgotPassModal={switchToForgotPassModal}
          />{" "}
        </div>
      )}
      {/* Signup Modal */}
      {isSignUpModalOpen && (
        <div key="signup">
          <SignUp
            switchToLoginModal={switchToLoginModal}
            toggleSignupModal={toggleSignupModal}
          />{" "}
        </div>
      )}

      {isOrderModalOpen && (
        <Order
          toggleOrderModal={toggleOrderModal}
          onOrderSuccess={() => {
            notification.success({ message: "Order successful!" });
          }}
        />
      )}
      {isForgotPasswordModalOpen && (
        <div>
          <ForgotPassword
            switchToForgotPassModal={switchToForgotPassModal}
            toogleForgotPasswordModal={toogleForgotPasswordModal}
          />
        </div>
      )}
    </>
  );
};

export default Header;
