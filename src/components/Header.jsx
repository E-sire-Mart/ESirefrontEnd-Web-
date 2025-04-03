import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoSearch, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const { totalPrice, totalQty } = useGlobalContext();
  const [openCartSection, setOpenCartSection] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }

    navigate("/user");
  };

  return (
    <header className="sticky top-0 z-50 shadow-md flex justify-center items-center gap-1 px-2 w-full bg-gradient-to-r from-customGreen to-customBlue">
      <div className="container lg:h-20 h-16 flex items-center justify-between ">
        {/**logo */}
        <div className="h-full">
          <Link to={"/"} className="h-full flex justify-center items-center">
            <img
              src={logo}
              width={170}
              height={60}
              alt="logo"
              className="hidden lg:block"
            />
            <img
              src={logo}
              width={120}
              height={60}
              alt="logo"
              className="lg:hidden"
            />
          </Link>
        </div>

        {/**Search */}
        <div className="md:block xl:block hidden">
          <Search />
        </div>

        {/**login and my cart */}
        <div className="flex justify-center gap-5 items-center">
          <div
            className="md:hidden block lg:hidden sm:block h-full text-white flex justify-center items-center"
          >
            <div 
            className="relative max-w-12 focus-within:max-w-full transition-[max-width] ease-in-out duration-300">
              <input
              className="block w-full border-none outline-none rounded-full p-[12px] px-4 text-base placeholder:text-transparent focus:placeholder:text-gray-500"
              placeholder="Search..."
              onClick={() => setShowSearchModal(true)}
              />
            <GoSearch 
            className=" text-black fa fa-search top-1/2 right-6 -translate-y-1/2 translate-x-1/2 absolute pointer-events-none"/>
            </div>
          </div>
          {/**user icons display in only mobile version**/}
          <button
            className="text-neutral-600 lg:hidden text-white"
            onClick={handleMobileUser}
          >
            <FaRegCircleUser size={26} />
          </button>

          {/**Desktop**/}
          <div className="hidden lg:flex items-center gap-10">
            {user?._id ? (
              <div className="relative">
                <div
                  onClick={() => setOpenUserMenu((preve) => !preve)}
                  className="flex select-none items-center gap-1 cursor-pointer"
                >
                  <p className="text-white">Account</p>
                  {openUserMenu ? (
                    <GoTriangleUp size={25} className="text-white" />
                  ) : (
                    <GoTriangleDown size={25} className="text-white" />
                  )}
                </div>
                {openUserMenu && (
                  <div className="absolute right-0 top-12">
                    <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                      <UserMenu close={handleCloseUserMenu} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={redirectToLoginPage}
                className="text-lg px-2 text-white hover:bg-white hover:text-indigo-600 hover:rounded-[5px] hover:pt-[5px] hover:pb-[5px]"
              >
                Login
              </button>
            )}
            <button
              onClick={() => setOpenCartSection(true)}
              className="flex items-center gap-2 
               px-3 py-2 rounded text-white rounded-[12px]"
            >
              {/**add to card icons */}
              <div className=" hover:bg-white px-[10px] pt-[5px] pb-[5px] hover:rounded-[5px]">
                <BsCart4
                  size={26}
                  className="hover:text-indigo-600 hover:animate-bounce"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}

      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <Search />
            <button onClick={() => setShowSearchModal(false)} className="mt-2 text-red-500">Close</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
