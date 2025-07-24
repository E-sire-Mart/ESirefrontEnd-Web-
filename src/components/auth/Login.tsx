import React, { useState, useEffect } from "react";
import backgroundImage from "../../assets/left_section.png";
import { FaAnglesRight } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LOGINDATA, userLogin } from "../../services/api/auth";
import { notification, Spin } from "antd"; // Import Spin component from antd
import { LoadingOutlined } from "@ant-design/icons";
import { setLoginStatus } from "../../store/status";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { GoogleLoginClientID } from "../../services/url";
import {
  // handleGoogleLoginSuccess,
  handleGoogleLoginError,
} from "../../services/api/auth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BASE_URL } from "../../services/url";

import {
  GoogleLogin,
  googleLogout,
  GoogleOAuthProvider,
} from "@react-oauth/google";

interface LoginProps {
  switchToSignupModal: () => void;
  toggleLoginModal: () => void;
  switchToForgotPassModal: () => void;
}

interface DecodedToken {
  email: string;
  name: string;
  given_name: string;
  family_name: string;
}

const Login: React.FC<LoginProps> = ({
  toggleLoginModal,
  switchToSignupModal,
  switchToForgotPassModal,
}) => {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(
    window.innerWidth <= 1023
  );
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async () => {
    const loginData: LOGINDATA = {
      email: email,
      password: password,
    };

    setLoading(true);

    try {
      const response = await userLogin(loginData);
      console.log(response);

      notification.success({
        message: "Login successfully",
      });
      dispatch(setLoginStatus(true));
      localStorage.setItem("user", JSON.stringify(response));

      toggleLoginModal();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = (response: any) => {
    if (response.error) {
      console.log(`Error: ${response.error}`);
      return;
    }

    const decodedToken = jwtDecode<DecodedToken>(response.credential);

    const data = {
      email: decodedToken.email,
      first_name: decodedToken.given_name,
      last_name: decodedToken.family_name,
    };

    axios
      .post(`${BASE_URL}/auth/loginWithGoogle`, data)
      .then((response) => {
        const tokenData = response.data; // This contains token_type, expires_in, access_token, and refresh_token

        if (!tokenData?.access_token) {
          throw new Error("No access token found in the response");
        }

        notification.success({
          message: "Logged in successfully with Google!",
        });

        dispatch(setLoginStatus(true));

        localStorage.setItem("user", JSON.stringify(tokenData));

        toggleLoginModal();
      })
      .catch((err) => {
        console.error("Error during Google login:", err.response);
        notification.error({
          message: "Google login failed!",
          description:
            "An error occurred during Google login. Please try again.",
        });
      });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1023);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="max-w-screen-lg m-0 sm:m-28 bg-white shadow sm:rounded-lg flex justify-center flex-1 relative">
          <button
            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 focus:outline-none"
            onClick={toggleLoginModal} // Close the modal when clicked
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
          <div
            className="flex-1 bg-[#06A67E] text-center hidden lg:flex sm:rounded-lg justify-center items-center"
            style={{
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="flex flex-col items-center justify-center p-8 rounded-lg max-w-sm">
              <h1 className="text-3xl font-bold text-white mb-4">
                Hello Friend!
              </h1>
              <p className="text-white mb-8 text-center">
                Enter your personal details and start your journey with us
              </p>

              <div
                onClick={switchToSignupModal}
                className="px-8 py-3 border-2 cursor-pointer border-white text-white rounded-full hover:bg-white hover:text-[#06A67E] transition-all duration-300 ease-in-out flex flex-row justify-center items-center"
              >
                <p className="mr-2">SIGN UP</p>
                <FaAnglesRight />
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 xl:w-7/12 p-8 bg-white rounded-lg py-24 flex justify-center items-center">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold text-center text-[#06A67E] mb-6">
                Sign In to Your Account
              </h2>
              <div className="flex justify-center items-center mt-10">
                <GoogleOAuthProvider clientId={GoogleLoginClientID}>
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginError}
                    useOneTap
                    shape="rectangular"
                    width="330px"
                    text="signin_with"
                  />
                </GoogleOAuthProvider>
              </div>
              <div className="flex items-center justify-center my-6">
                <div className="flex-grow h-px bg-gray-300"></div>{" "}
                <span className="px-3 text-gray-500 text-sm">or</span>{" "}
                <div className="flex-grow h-px bg-gray-300"></div>{" "}
              </div>
              <div className="space-y-4 flex justify-center items-center flex-col">
                <div className="border border-gray-300 w-full rounded-lg">
                  <input
                    className="w-full px-5 py-4 rounded-lg font-medium bg-white border border-gray-300 placeholder-gray-500 text-sm focus:outline-none focus:border-[#06A67E]"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="border border-gray-300 w-full rounded-lg relative">
                  <input
                    className="w-full px-5 py-4 rounded-lg font-medium bg-white border border-gray-300 placeholder-gray-500 text-sm focus:outline-none focus:border-[#06A67E]"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
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
              </div>

              <div className="text-right my-3">
                <a
                  onClick={switchToForgotPassModal}
                  className="text-sm font-medium text-gray-600 hover:underline cursor-pointer"
                >
                  forgot password?
                </a>
              </div>
              <div
                onClick={handleLogin}
                className="w-full cursor-pointer hidden mt-4 py-4 lg:flex justify-center items-center bg-[#06A67E] text-white font-semibold rounded-lg hover:bg-opacity-90 transition duration-300 ease-in-out"
              >
                {loading ? (
                  <Spin
                    indicator={<LoadingOutlined spin />}
                    style={{ marginRight: "15px", color: "#fff" }}
                  />
                ) : (
                  "SIGN IN"
                )}
              </div>
              {isMobileView && (
                <div className="flex flex-row justify-between items-center">
                  <div
                    onClick={handleLogin}
                    className="w-full cursor-pointer mt-4 py-4 flex justify-center items-center bg-[#06A67E] text-white font-semibold rounded-[50px] hover:bg-opacity-90 transition duration-300 ease-in-out"
                  >
                    {loading ? (
                      <Spin
                        indicator={<LoadingOutlined spin />}
                        style={{ marginRight: "15px", color: "#fff" }}
                      />
                    ) : (
                      "SIGN IN"
                    )}{" "}
                  </div>
                  <div
                    onClick={switchToSignupModal}
                    className="w-full cursor-pointer mt-4 py-4 flex justify-center items-center bg-[#06A67E] text-white font-semibold rounded-[50px] hover:bg-opacity-90 transition duration-300 ease-in-out"
                  >
                    <p className="mr-2">SIGN UP</p>
                    <FaAnglesRight />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
