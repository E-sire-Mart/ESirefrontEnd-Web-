// export const SERVER_URL = 'http://localhost:5000'; // Update your server url
// export const razorpayKeyId = "rzp_test_FChFjA06oHTdte"; // Update your razor pay key id
// export const GOOGLE_MAP_API_KEY = "AIzaSyCoISnyV76a5pQ94mzu-lbLoXn2wcFxwTo";
// export const CompanyName = "Your Company";
// export const ComapnyDescription = "Test transaction";
export const SERVER_URL = import.meta.env.VITE_SERVER_URL; // Update your server url
const env = import.meta.env;
console.log(env)
console.log("$$$$$$$", SERVER_URL)

export const razorpayKeyId = import.meta.env.VITE_razorpayKeyId;
export const GOOGLE_MAP_API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
export const CompanyName = import.meta.env.VITE_CompanyName;
export const ComapnyDescription = import.meta.env.VITE_ComapnyDescription;
export const GoogleLoginClientID= import.meta.env.VITE_PUBLIC_GOOGLE_CLIENT_ID;
export const BASE_URL = `${SERVER_URL}/api/v1`;
export const SITE_KEY = import.meta.env.VITE_REACT_APP_RECAPTCHA_SITE_KEY;

export const LIST_PRODUCTS = `${BASE_URL}/product/products`;
export const LIST_DISCOUNTED_PRODUCTS = `${BASE_URL}/product/discounts`;
export const LOGIN = `${BASE_URL}/auth/login`;
export const REGISTER = `${BASE_URL}/auth/userRegister`;
export const FORGOTPASSWORD = `${BASE_URL}/auth/password-forgot`;
export const CHANGEPASSWORD = `${BASE_URL}/users/change-password`;
export const ORDERCREATEURL = `${BASE_URL}/orders/create-order`;
export const GETORDERS = `${BASE_URL}/orders`
export const VERIFYPAYMENT = `${BASE_URL}/orders/verify-payment`;
export const ADDCART=`${BASE_URL}/cart/add-to-cart`;
export const ORDERURL = `${BASE_URL}/orders/order`;
export const PRODUCTBYSHOPID = `${BASE_URL}/orders/order`;