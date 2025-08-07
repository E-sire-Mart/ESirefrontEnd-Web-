import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      console.log("Parsed user data:", parsedUser);
      
      if (!parsedUser.access_token) {
        console.error("No access token found in user data");
        throw new Error("No access token available");
      }
      
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${parsedUser.access_token}`,
      };
    } catch (error) {
      console.error("Error parsing user data:", error);
      throw new Error("Invalid user data format");
    }
  }
  throw new Error("No user data found");
};

// Get all user's payment methods
export const getAllPayments = async () => {
  try {
    const headers = getAuthHeaders();
    const { data } = await axios.get(`${BASE_URL}/api/v1/payment`, {
      headers,
    });
    return data;
  } catch (error: any) {
    console.error("Get payments error:", error.response?.data || error.message);
    throw error;
  }
};

// Get user's default payment method
export const getDefaultPayment = async () => {
  try {
    const headers = getAuthHeaders();
    const { data } = await axios.get(`${BASE_URL}/api/v1/payment/default`, {
      headers,
    });
    return data;
  } catch (error: any) {
    console.error("Get default payment error:", error.response?.data || error.message);
    throw error;
  }
};

// Add new payment method
export const addPayment = async (paymentData: any) => {
  try {
    const headers = getAuthHeaders();
    console.log("Sending payment request with headers:", headers);
    
    const { data } = await axios.post(`${BASE_URL}/api/v1/payment/add`, paymentData, {
      headers,
    });
    return data;
  } catch (error: any) {
    console.error("Payment API error:", error.response?.data || error.message);
    throw error;
  }
};

// Helper function to validate payment data before sending to backend
export const validatePaymentData = (paymentData: any) => {
  const errors: string[] = [];

  // Required fields
  if (!paymentData.type || !paymentData.name) {
    errors.push('Payment type and name are required');
  }

  // Validate payment type
  const validTypes = ['card', 'upi', 'wallet', 'paypal', 'peonio'];
  if (paymentData.type && !validTypes.includes(paymentData.type)) {
    errors.push('Invalid payment type');
  }

  // Card-specific validation
  if (paymentData.type === 'card') {
    if (!paymentData.number || !paymentData.cardType || !paymentData.expiryDate || !paymentData.cvv) {
      errors.push('Card number, type, expiry date, and CVV are required for card payments');
    }

    // Validate card number format
    if (paymentData.number) {
      const cleanNumber = paymentData.number.replace(/\s/g, '');
      if (!/^\d{13,19}$/.test(cleanNumber)) {
        errors.push('Invalid card number format');
      }
    }

    // Validate expiry date format
    if (paymentData.expiryDate) {
      const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
      if (!expiryRegex.test(paymentData.expiryDate)) {
        errors.push('Invalid expiry date format. Use MM/YY format');
      }

      // Check if card is expired
      const [month, year] = paymentData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      const cardYear = parseInt(year);
      const cardMonth = parseInt(month);
      
      if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
        errors.push('Card has expired');
      }
    }

    // Validate CVV
    if (paymentData.cvv && !/^\d{3,4}$/.test(paymentData.cvv)) {
      errors.push('CVV must be 3 or 4 digits');
    }
  }

  // UPI-specific validation
  if (paymentData.type === 'upi') {
    if (!paymentData.number) {
      errors.push('UPI ID is required');
    } else {
      const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
      if (!upiRegex.test(paymentData.number)) {
        errors.push('Invalid UPI ID format');
      }
    }
  }

  return errors;
};

// Update payment method
export const updatePayment = async (id: string, paymentData: any) => {
  try {
    const headers = getAuthHeaders();
    const { data } = await axios.put(`${BASE_URL}/api/v1/payment/update/${id}`, paymentData, {
      headers,
    });
    return data;
  } catch (error: any) {
    console.error("Update payment error:", error.response?.data || error.message);
    throw error;
  }
};

// Set payment method as default
export const setDefaultPayment = async (id: string) => {
  try {
    const headers = getAuthHeaders();
    const { data } = await axios.put(`${BASE_URL}/api/v1/payment/default/${id}`, {}, {
      headers,
    });
    return data;
  } catch (error: any) {
    console.error("Set default payment error:", error.response?.data || error.message);
    throw error;
  }
};

// Delete (soft delete) payment method
export const deletePayment = async (id: string) => {
  try {
    console.log("Deleting payment with ID:", id);
    const headers = getAuthHeaders();
    console.log("Delete request URL:", `${BASE_URL}/api/v1/payment/delete/${id}`);
    
    const { data } = await axios.delete(`${BASE_URL}/api/v1/payment/delete/${id}`, {
      headers,
    });
    console.log("Delete response:", data);
    return data;
  } catch (error: any) {
    console.error("Delete payment error:", error.response?.data || error.message);
    throw error;
  }
};