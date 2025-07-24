import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoSendSharp } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgetPassword = () => {
  const [isOpen, setIsOpen] = useState(true); // State to control modal visibility
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState); // Toggle between true and false
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="max-w-screen-sm m-0 sm:m-28 bg-white shadow sm:rounded-lg flex justify-center flex-1 relative">
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 focus:outline-none"
              onClick={closeModal}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <div className="p-8 w-full bg-white rounded-lg py-18 flex justify-center items-center">
              <div className="w-full">
                <h2 className="text-3xl font-bold text-center text-[#06A67E] mb-4">
                  Reset password!
                </h2>

                <div className="border border-gray-300 w-full rounded-lg relative mt-5">
                  <input
                    className="w-full px-5 py-7 rounded-lg font-medium bg-white border border-gray-300 placeholder-gray-500 text-sm focus:outline-none focus:border-[#06A67E]"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-5 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="border border-gray-300 w-full rounded-lg relative mt-5">
                  <input
                    className="w-full px-5 py-7 rounded-lg font-medium bg-white border border-gray-300 placeholder-gray-500 text-sm focus:outline-none focus:border-[#06A67E]"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat Password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-5 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="w-full cursor-pointer gap-2 mt-5 py-4 flex justify-center items-center bg-[#06A67E] text-white font-semibold rounded-lg hover:bg-opacity-90 transition duration-300 ease-in-out">
                  Reset Password
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgetPassword;
