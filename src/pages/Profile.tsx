import React, { useState, useEffect } from "react";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LockOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  ShoppingOutlined,
  HeartOutlined,
  EnvironmentOutlined,
  BellOutlined,
  SecurityScanOutlined,
  CreditCardOutlined,
  CameraOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  EyeInvisibleOutlined,
  PlusCircleOutlined,
  ShoppingCartOutlined,
  ShopOutlined
} from "@ant-design/icons";
import { 
  notification, 
  Button, 
  Input, 
  Modal, 
  Tabs, 
  Avatar, 
  Card, 
  Divider, 
  Badge, 
  Upload, 
  message,
  Table,
  Tag,
  Progress,
  Empty,
  Tooltip,
  Form,
  Select,
  InputNumber,
  Drawer,
  List,
  Spin
} from "antd";
import { getOrders } from "../services/api/order";
import { getUserProfile, updateUserProfile, uploadAvatar, getAvatarUrl } from "../services/api/user";
import { getAllPayments, getDefaultPayment, addPayment, updatePayment, setDefaultPayment, deletePayment, validatePaymentData } from "../services/api/payment";
import { changePassword } from "../services/api/auth";

import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { addItem, removeItem, setCartItems, setTotalQuantity, setBillAmount } from "../store/cart";
import { useCart } from "../hooks/useCart";
import "./style.css";
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;
const { Option } = Select;

interface UserProfile {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
}

interface Order {
  orderId: string;
  shopName: string;
  products: any[];
  price: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  shopName: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet' | 'paypal' | 'peonio';
  name: string;
  number?: string;
  isDefault: boolean;
  expiryDate?: string;
  cardType?: string;
}

// Add Address type
interface Address {
  key: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
  landmark?: string;
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [originalUserData, setOriginalUserData] = useState<UserProfile | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      name: "HDFC Credit Card",
      number: "**** **** **** 1234",
      isDefault: true,
      expiryDate: "12/25",
      cardType: "Visa"
    },
    {
      id: "2", 
      type: "upi",
      name: "UPI ID",
      number: "user@upi",
      isDefault: false
    }
  ]);

  // Password change modal states
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Payment method modal states
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [paymentForm] = Form.useForm();
  
  // Delete confirmation modal states
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<PaymentMethod | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Order from cart modal states
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [orderLoading, setOrderLoading] = useState(false);

  // Address management modal states
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm] = Form.useForm();

  const openAddressModal = (address: Address | null = null) => {
    setEditingAddress(address);
    setAddressModalVisible(true);
    if (address) addressForm.setFieldsValue(address);
    else addressForm.resetFields();
  };

  const handleSaveAddress = async () => {
    const values = await addressForm.validateFields();
    if (editingAddress) {
      setAddresses((prev: Address[]) => prev.map((addr: Address) => addr.key === editingAddress.key ? { ...values, key: editingAddress.key } : addr));
    } else {
      setAddresses((prev: Address[]) => [...prev, { ...values, key: Date.now().toString() }]);
    }
    setAddressModalVisible(false);
    setEditingAddress(null);
    addressForm.resetFields();
  };

  const handleDeleteAddress = (key: string) => {
    setAddresses((prev: Address[]) => prev.filter((addr: Address) => addr.key !== key));
  };

  // Get cart items from Redux store
  const { cartItems, totalQuantity, billAmount } = useAppSelector((state) => state.cart);
  const { addToCart, decreaseQuantity, removeFromCart } = useCart();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleRegisterStore = () => {
    // Redirect to vendor portal on the same domain
    window.location.href = '/vendor';
  };

  // Membership removed

  // Cart item deletion confirmation modal states
  const [deleteCartItemModalVisible, setDeleteCartItemModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    console.log("Profile component mounted, loading data...");
    loadUserProfile();
    loadOrders();
    loadPaymentMethods();
  }, []);

  // Debug effect to monitor userProfile state changes
  useEffect(() => {
    console.log("userProfile state updated:", userProfile);
    console.log("userProfile.firstName:", userProfile.firstName);
    console.log("userProfile.email:", userProfile.email);
  }, [userProfile]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      console.log("Starting to load user profile...");
      
      const userData = await getUserProfile();
      console.log("User data from backend:", userData);
      
      // Map only the required fields from the backend response
      const mappedProfile = {
        firstName: userData.user.first_name || "",
        lastName: userData.user.last_name || "",
        fullName: `${userData.user.first_name || ""} ${userData.user.last_name || ""}`.trim(),
        email: userData.user.email || "",
        phoneNumber: userData.user.phone_number || "",
      };
      
      console.log("Mapped profile data:", mappedProfile);
      setUserProfile(mappedProfile);
      setOriginalUserData(mappedProfile);
      
      // Handle avatar
      const userAvatar = userData.user.avatar || "";
      console.log('Loaded avatar from backend:', userAvatar);
      
      // Construct full avatar URL if avatar exists
      const fullAvatarUrl = getAvatarUrl(userAvatar);
      setAvatarUrl(fullAvatarUrl);
      console.log('Set initial avatar URL:', fullAvatarUrl);
    } catch (error) {
      console.error("Error loading profile:", error);
      // Don't show error notification to avoid blocking the page
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const ordersData = await getOrders();
      if (ordersData && Array.isArray(ordersData)) {
        const formattedOrders = ordersData.map((item: any) => ({
          orderId: item.razorpay_order_id,
          shopName: item.shopId.name,
          products: item.items.map((product: any) => ({
            productId: product.productId._id,
            productName: product.productId.name,
            price: product.price,
            quantity: product.quantity,
          })),
          price: item.totalPrice,
          status: item.status,
          createdAt: new Date(item.created_at).toLocaleDateString(),
          paymentMethod: item.payment_method || "Credit Card",
          paymentStatus: item.payment_status || "Paid"
        }));
        setOrders(formattedOrders);
      } else {
        console.warn("Orders data is not in expected format:", ordersData);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await getAllPayments();
      console.log("Payment methods response from backend:", response);
      
      // Handle different response formats from backend
      let paymentsData = [];
      
      if (response && response.success && response.data) {
        // Backend returns { success: true, data: [...] }
        paymentsData = Array.isArray(response.data) ? response.data : [];
      } else if (response && Array.isArray(response)) {
        // Backend returns array directly
        paymentsData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Backend returns { data: [...] }
        paymentsData = response.data;
      } else {
        console.warn("Payment methods data is not in expected format:", response);
        paymentsData = [];
      }
      
      console.log("Processed payment methods:", paymentsData);
      
      // Ensure each payment method has the correct ID field
      const processedPayments = paymentsData.map((payment: any) => ({
        ...payment,
        id: payment.id || payment._id || payment.paymentId || payment.payment_id,
      }));
      
      console.log("Final processed payments:", processedPayments);
      setPaymentMethods(processedPayments);
    } catch (error) {
      console.error("Error loading payment methods:", error);
      // Don't show error notification to avoid blocking the page
      setPaymentMethods([]);
    } finally {
      setLoading(false);
    }
  };



  const handleSaveProfile = async () => {
    try {
      // Check if originalUserData exists
      if (!originalUserData) {
        notification.error({
          message: 'Original user data not available',
          placement: 'topRight',
        });
        return;
      }

      // Check if any changes were made (excluding avatar - handled separately)
      const hasChanges = 
        userProfile.firstName !== originalUserData?.firstName ||
        userProfile.lastName !== originalUserData?.lastName ||
        userProfile.fullName !== originalUserData?.fullName ||
        userProfile.email !== originalUserData?.email ||
        userProfile.phoneNumber !== originalUserData?.phoneNumber;

      // If no changes were made, show a notification and return
      if (!hasChanges) {
        notification.info({
          message: 'No changes detected',
          placement: 'topRight',
        });
        return;
      }

      // Create JSON object for profile data (excluding avatar)
      const profileData = {
        first_name: userProfile.firstName,
        last_name: userProfile.lastName,
        full_name: userProfile.fullName,
        email: userProfile.email,
        phone_number: userProfile.phoneNumber
      };

      console.log('Sending profile update with JSON data:', profileData);

      // Send the profile data to the backend
      const response = await updateUserProfile(profileData);
      console.log('Profile update response:', response);
      
      // Check if the update was successful (handle different response formats)
      const isSuccess = response.success || response.status === 'success' || response.message === 'Profile updated successfully' || response.user;
      
      if (isSuccess) {
        notification.success({
          message: 'Profile updated successfully',
          placement: 'topRight',
        });
        setIsEditing(false);
        // Reload the profile to get the updated data
        await loadUserProfile();
      } else {
        console.error('Profile update failed:', response);
        notification.error({
          message: response.message || response.error || 'Failed to update profile',
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      notification.error({
        message: 'Failed to update profile. Please try again.',
        placement: 'topRight',
      });
    }
  };

  const handleAvatarUpload = async (info: any) => {
    console.log('Avatar upload info:', info);
    
    if (info.file.status === 'uploading') {
      // File is being uploaded
      return;
    }
    
    if (info.file.status === 'done') {
      // Upload completed successfully
      try {
        const response = await uploadAvatar(info.file.originFileObj);
        console.log('Avatar upload response:', response);
        
        if (response.success) {
          notification.success({
            message: 'Avatar uploaded successfully!',
            placement: 'topRight',
          });
          
          // Update the avatar URL with the new file
          if (response.data && response.data.avatar) {
            const avatarUrl = getAvatarUrl(response.data.avatar);
            setAvatarUrl(avatarUrl);
          }
          
          // Reload profile to get updated data
          await loadUserProfile();
        } else {
          notification.error({
            message: response.message || 'Failed to upload avatar',
            placement: 'topRight',
          });
        }
      } catch (error) {
        console.error('Avatar upload error:', error);
        notification.error({
          message: 'Failed to upload avatar. Please try again.',
          placement: 'topRight',
        });
      }
    }
    
    // Handle any errors
    if (info.file.status === 'error') {
      notification.error({
        message: `${info.file.name} upload failed.`,
        placement: 'topRight',
      });
    }
  };

  // Password change functions
  const handlePasswordChange = async (values: any) => {
    setLoading(true);
    try {
      const { oldPassword, newPassword } = values;
      
      // Call the backend API to change password
      const response = await changePassword(oldPassword, newPassword);
      
      notification.success({
        message: "Password changed successfully!",
        description: response.message || "Your password has been updated.",
        placement: "topRight",
      });
      
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error: any) {
      console.error('Password change error:', error);
      notification.error({
        message: "Failed to change password",
        description: error.message || "Please check your current password and try again.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  // Payment method functions
  const handleAddPaymentMethod = () => {
    setEditingPayment(null);
    setPaymentModalVisible(true);
    paymentForm.resetFields();
  };

  const handleEditPaymentMethod = (payment: PaymentMethod) => {
    console.log("Editing payment method:", payment);
    setEditingPayment(payment);
    setPaymentModalVisible(true);
    
    // Set form values, excluding sensitive data like CVV for security
    const formData = {
      type: payment.type,
      name: payment.name,
      number: payment.number,
      expiryDate: payment.expiryDate,
      cardType: payment.cardType,
      // Don't set CVV for security reasons
    };
    
    paymentForm.setFieldsValue(formData);
  };

  const handleDeletePaymentMethod = (payment: PaymentMethod) => {
    setPaymentToDelete(payment);
    setDeleteModalVisible(true);
  };

  const confirmDeletePayment = async () => {
    if (!paymentToDelete) {
      notification.error({
        message: "No payment method selected for deletion",
      });
      return;
    }
    
    console.log("Deleting payment method:", paymentToDelete);
    console.log("Payment ID:", paymentToDelete.id);
    
    if (!paymentToDelete.id) {
      notification.error({
        message: "Invalid payment method ID",
      });
      return;
    }
    
    try {
      setDeleteLoading(true);
      await deletePayment(paymentToDelete.id);
      
      // Refresh payment methods from backend
      await loadPaymentMethods();
      
      notification.success({
        message: "Payment method deleted successfully!",
      });
      
      setDeleteModalVisible(false);
      setPaymentToDelete(null);
    } catch (error: any) {
      console.error("Error deleting payment method:", error);
      notification.error({
        message: "Failed to delete payment method",
        description: error.response?.data?.message || error.message || "Please try again",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDeletePayment = () => {
    setDeleteModalVisible(false);
    setPaymentToDelete(null);
  };

  const handleSavePaymentMethod = async (values: any) => {
    try {
      // Debug: Check user authentication
      const userData = localStorage.getItem('user');
      console.log("User data in localStorage:", userData);
      
      if (!userData) {
        notification.error({
          message: "Authentication Error",
          description: "Please log in again to add payment methods",
        });
        return;
      }

      // Validate payment data before sending to backend
      const validationErrors = validatePaymentData(values);
      if (validationErrors.length > 0) {
        notification.error({
          message: "Validation Error",
          description: validationErrors.join(', '),
        });
        return;
      }

      console.log("Sending payment data to backend:", values);

      if (editingPayment) {
        // Update existing payment method
        console.log("Updating payment method:", editingPayment.id, values);
        const response = await updatePayment(editingPayment.id, values);
        console.log("Update response:", response);
        
        if (response.success && response.data) {
          // Refresh payment methods from backend to get the latest data
          await loadPaymentMethods();
          notification.success({
            message: response.message || "Payment method updated successfully!",
          });
        } else {
          throw new Error(response.message || "Failed to update payment method");
        }
      } else {
        // Add new payment method
        const response = await addPayment(values);
        console.log("Backend response:", response);
        
        if (response.success && response.data) {
          // Refresh payment methods from backend to get the latest data
          await loadPaymentMethods();
          notification.success({
            message: response.message || "Payment method added successfully!",
          });
        } else {
          throw new Error(response.message || "Failed to add payment method");
        }
      }
      setPaymentModalVisible(false);
      paymentForm.resetFields();
    } catch (error: any) {
      console.error("Error saving payment method:", error);
      const errorMessage = error.response?.data?.message || error.message || "Please try again";
      notification.error({
        message: "Failed to save payment method",
        description: errorMessage,
      });
    }
  };

  const handleSetDefaultPayment = async (paymentId: string) => {
    try {
      console.log("Setting default payment method:", paymentId);
      const response = await setDefaultPayment(paymentId);
      console.log("Set default response:", response);
      
      if (response.success) {
        // Refresh payment methods from backend to get the latest data
        await loadPaymentMethods();
        notification.success({
          message: response.message || "Default payment method updated successfully!",
        });
      } else {
        throw new Error(response.message || "Failed to set default payment method");
      }
    } catch (error: any) {
      console.error("Error setting default payment method:", error);
      notification.error({
        message: "Failed to set default payment method",
        description: error.response?.data?.message || error.message || "Please try again",
      });
    }
  };

  // Cart management functions with backend integration
  const handleIncreaseQuantity = async (item: any, storeId: string) => {
    try {
      await addToCart(item.product);
      notification.success({
        message: "Quantity Updated",
        description: `Quantity of ${item.product.name} has been increased.`,
        placement: "topRight",
        duration: 2,
      });
    } catch (error) {
      notification.error({
        message: "Failed to Update",
        description: "Unable to update item quantity. Please try again.",
        placement: "topRight",
        duration: 3,
      });
    }
  };

  const handleDecreaseQuantity = async (item: any, storeId: string) => {
    try {
      await decreaseQuantity(item.product.id, item.product.shopId);
      notification.success({
        message: "Quantity Updated",
        description: `Quantity of ${item.product.name} has been decreased.`,
        placement: "topRight",
        duration: 2,
      });
    } catch (error) {
      notification.error({
        message: "Failed to Update",
        description: "Unable to update item quantity. Please try again.",
        placement: "topRight",
        duration: 3,
      });
    }
  };

  const handleRemoveFromCart = (item: any, storeId: string) => {
    // Show confirmation modal instead of immediate deletion
    setItemToDelete(item);
    setDeleteCartItemModalVisible(true);
  };

  const confirmDeleteCartItem = async () => {
    if (!itemToDelete) return;
    
    try {
      // Remove all quantities of the item
      const currentQuantity = itemToDelete.quantity;
      for (let i = 0; i < currentQuantity; i++) {
        await removeFromCart(itemToDelete.product.id, itemToDelete.product.shopId);
      }
      
      notification.success({
        message: "Item Removed",
        description: `${itemToDelete.product.name} has been removed from your cart.`,
        placement: "topRight",
        duration: 2,
      });
      
      setDeleteCartItemModalVisible(false);
      setItemToDelete(null);
    } catch (error) {
      notification.error({
        message: "Failed to Remove",
        description: "Unable to remove item from cart. Please try again.",
        placement: "topRight",
        duration: 3,
      });
    }
  };

  // Order from cart functions
  const handleOrderFromCart = () => {
    if (totalQuantity === 0) {
      notification.warning({
        message: "Your cart is empty",
      });
      return;
    }
    setOrderModalVisible(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) {
      notification.error({
        message: "Please select a payment method",
      });
      return;
    }

    setOrderLoading(true);
    try {
      // Here you would make an API call to place the order
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      notification.success({
        message: "Order placed successfully!",
      });
      
      // Clear cart after successful order
      dispatch(setCartItems({}));
      dispatch(setTotalQuantity(0));
      dispatch(setBillAmount(0));
      
      setOrderModalVisible(false);
      setSelectedPaymentMethod("");
    } catch (error) {
      notification.error({
        message: "Failed to place order",
      });
    } finally {
      setOrderLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "success";
      case "pending":
      case "processing":
        return "warning";
      case "cancelled":
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return <CheckCircleOutlined className="text-green-500" />;
      case "pending":
      case "processing":
        return <ClockCircleOutlined className="text-yellow-500" />;
      case "cancelled":
      case "failed":
        return <CloseCircleOutlined className="text-red-500" />;
      default:
        return <ClockCircleOutlined className="text-gray-500" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
        return "green";
      case "pending":
        return "orange";
      case "failed":
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <Card className="shadow-sm border-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar 
                size={80} 
                src={avatarUrl || undefined}
                icon={<UserOutlined />}
                className="bg-gradient-to-r from-green-400 to-green-600"
                onError={() => {
                  console.log('Avatar failed to load, using default icon');
                  setAvatarUrl(""); // Clear the URL to show default icon
                  return false; // Prevent default error handling
                }}
              />
              
              {/* File Upload Section */}
              <Upload
                name="avatar"
                showUploadList={false}
                beforeUpload={(file) => {
                  // Validate file type
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    notification.error({
                      message: 'You can only upload image files!',
                      placement: 'topRight',
                    });
                    return false;
                  }
                  
                  // Validate file size (max 5MB)
                  const isLt5M = file.size / 1024 / 1024 < 5;
                  if (!isLt5M) {
                    notification.error({
                      message: 'Image must be smaller than 5MB!',
                      placement: 'topRight',
                    });
                    return false;
                  }
                  
                  // Create immediate preview
                  const previewUrl = URL.createObjectURL(file);
                  setAvatarUrl(previewUrl);
                  return true; // Allow upload
                }}
                onChange={handleAvatarUpload}
                accept="image/*"
                maxCount={1}
                customRequest={async ({ file, onSuccess, onError }) => {
                  try {
                    if (file instanceof File) {
                      const response = await uploadAvatar(file);
                      if (response.success) {
                        onSuccess?.(response);
                      } else {
                        onError?.(new Error(response.message || 'Upload failed'));
                      }
                    } else {
                      onError?.(new Error('Invalid file type'));
                    }
                  } catch (error) {
                    onError?.(error as Error);
                  }
                }}
              >
                <Button
                  type="text"
                  shape="circle"
                  icon={<CameraOutlined />}
                  size="small"
                  className="absolute -bottom-1 -right-1 bg-green-600 text-white border-green-600 hover:bg-green-700"
                  style={{ width: '32px', height: '32px' }}
                />
              </Upload>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {userProfile.firstName} {userProfile.lastName}
              </h2>
              <p className="text-gray-500">Member since {new Date().getFullYear()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              type="default"
              icon={<ShopOutlined />}
              onClick={handleRegisterStore}
            >
              Register Your Store
            </Button>
            <Button
              type="primary"
              icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
              onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
              loading={loading}
              className="bg-green-600 border-green-600 hover:bg-green-700"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </div>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                value={userProfile.firstName}
                onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})}
                disabled={!isEditing}
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                value={userProfile.lastName}
                onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})}
                disabled={!isEditing}
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                value={userProfile.fullName}
                onChange={(e) => setUserProfile({...userProfile, fullName: e.target.value})}
                disabled={!isEditing}
                className="h-12"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                value={userProfile.email}
                onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                disabled={!isEditing}
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                value={userProfile.phoneNumber}
                onChange={(e) => {
                  // Only allow digits, +, -, (, ), and spaces
                  const cleanedValue = e.target.value.replace(/[^0-9+\-()\s]/g, '');
                  setUserProfile({...userProfile, phoneNumber: cleanedValue});
                }}
                disabled={!isEditing}
                className="h-12"
                placeholder="+1234567890"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              onClick={() => {
                setIsEditing(false);
                loadUserProfile();
              }}
              icon={<CloseOutlined />}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSaveProfile}
              loading={loading}
              icon={<SaveOutlined />}
              className="bg-green-600 border-green-600 hover:bg-green-700"
            >
              Save Changes
            </Button>
          </div>
        )}
      </Card>
    </div>
  );

  const renderCartSection = () => {
    // Convert cartItems object to array for rendering
    const cartItemsArray = Object.values(cartItems).flat();
    
    return (
      <div className="space-y-4">
        {cartItemsArray.length === 0 ? (
          <Card className="text-center py-12">
            <ShoppingOutlined className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your Cart is Empty</h3>
            <p className="text-gray-500">Add some items to your cart to see them here</p>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Cart Items ({totalQuantity})</h3>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-xl font-bold text-green-600">₹{billAmount}</p>
              </div>
            </div>
            
            {cartItemsArray.map((item: any, index: number) => (
              <Card key={`${item.product?.id || index}`} className="shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 bg-white rounded-xl overflow-hidden">
                <div className="p-3">
                  <div className="flex items-center space-x-3">
                    {/* Product Image */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                        {item.product?.image ? (
                          <img 
                            src={(() => {
                              const image = item.product.image;
                              if (Array.isArray(image)) {
                                return image.length > 0 ? `${import.meta.env.VITE_SERVER_URL}/${image[0]}` : '';
                              }
                              if (typeof image === 'string') {
                                return `${import.meta.env.VITE_SERVER_URL}/${image}`;
                              }
                              return '';
                            })()} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const placeholder = document.createElement('div');
                              placeholder.className = 'w-full h-full bg-gray-200 flex items-center justify-center';
                              placeholder.innerHTML = '<svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>';
                              e.currentTarget.parentElement?.appendChild(placeholder);
                            }}
                          />
                                                 ) : (
                           <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                             <ShoppingOutlined className="text-xl text-gray-400" />
                           </div>
                         )}
                       </div>
                       {/* Quantity Badge */}
                       <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                         {item.quantity}
                       </div>
                    </div>

                                         {/* Product Details */}
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between">
                         <div className="flex-1 min-w-0">
                           <h4 className="font-bold text-gray-900 text-base mb-1 truncate">
                             {item.product?.title || item.product?.name || "Product Name"}
                           </h4>
                           <p className="text-sm text-gray-600 mb-1 line-clamp-1">
                             {item.product?.subTitle || item.product?.description || "Product description not available"}
                           </p>
                           
                           {/* Store and Discount Badges */}
                           <div className="flex items-center space-x-2 mb-2">
                             <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                               <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                 <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                               </svg>
                               {item.product?.shopName || "Store"}
                             </span>
                             {item.product?.mrp && item.product?.newPrice && item.product.mrp > item.product.newPrice && (
                               <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                 <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                   <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                 </svg>
                                 {Math.round(((item.product.mrp - item.product.newPrice) / item.product.mrp) * 100)}% OFF
                               </span>
                             )}
                           </div>
 
                           {/* Price Section */}
                           <div className="flex items-center space-x-2">
                             {item.product?.mrp && item.product?.newPrice && item.product.mrp > item.product.newPrice ? (
                               <>
                                 <span className="text-lg font-bold text-green-600">₹{item.product.newPrice}</span>
                                 <span className="text-gray-400 line-through text-sm">₹{item.product.mrp}</span>
                               </>
                             ) : (
                               <span className="text-lg font-bold text-green-600">₹{item.product?.newPrice || item.product?.price}</span>
                             )}
                           </div>
                         </div>

                                                 {/* Quantity Controls */}
                         <div className="flex flex-col items-end space-y-2 ml-3">
                           <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
                             <Button 
                               type="text"
                               size="small" 
                               icon={<MinusOutlined />} 
                               onClick={() => handleDecreaseQuantity(item, Object.keys(cartItems)[0])}
                               disabled={item.quantity <= 1}
                               className="hover:bg-gray-200 rounded-md text-base"
                             />
                             <span className="text-sm font-semibold text-gray-700 min-w-[20px] text-center">{item.quantity}</span>
                             <Button 
                               type="text"
                               size="small" 
                               icon={<PlusOutlined />} 
                               onClick={() => handleIncreaseQuantity(item, Object.keys(cartItems)[0])}
                               className="hover:bg-gray-200 rounded-md text-base"
                             />
                           </div>
                           
                           <Button 
                             type="text"
                             size="small" 
                             icon={<DeleteOutlined />} 
                             danger
                             onClick={() => handleRemoveFromCart(item, Object.keys(cartItems)[0])}
                             className="hover:bg-red-50 rounded-md text-base"
                           />
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {/* Stylish Cart Summary */}
            <div className="mt-6 relative overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white bg-opacity-20 rounded-full p-2">
                        <ShoppingOutlined className="text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Cart Summary</h3>
                        <p className="text-green-100 text-sm">Ready to checkout</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">₹{billAmount}</div>
                      <div className="text-green-100 text-sm">Total Amount</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white border-opacity-20">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{totalQuantity}</div>
                      <div className="text-green-100 text-xs">Total Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{cartItemsArray.length}</div>
                      <div className="text-green-100 text-xs">Unique Products</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                type="primary"
                size="large"
                icon={<ShoppingOutlined />}
                onClick={handleOrderFromCart}
                className="bg-green-600 border-green-600 hover:bg-green-700"
              >
                Order from Cart (₹{billAmount})
              </Button>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderOrdersSection = () => (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <Card className="text-center py-12">
          <ShoppingOutlined className="text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h3>
          <p className="text-gray-500">Start shopping to see your orders here</p>
        </Card>
      ) : (
        orders.map((order) => (
          <Card key={order.orderId} className="shadow-sm border-0 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order.orderId}</h3>
                  <p className="text-gray-600">{order.shopName}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(order.status)}
                    <Badge 
                      status={getStatusColor(order.status) as any}
                      text={order.status}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    <CalendarOutlined className="mr-1" />
                    {order.createdAt}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">Payment Details</span>
                  <Tag color={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Tag>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Payment Method:</span>
                    <p className="font-medium">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Amount:</span>
                    <p className="font-medium text-green-600">₹{order.price}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Items ({order.products.length})</h4>
                <div className="space-y-2">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                      </div>
                      <span className="text-green-600 font-medium">₹{product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );

  const renderPaymentsSection = () => (
    <div className="space-y-6">
      <Card className="shadow-sm border-0">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <CreditCardOutlined className="mr-2 text-green-600" />
            Payment Methods
          </h3>
          <Button 
            type="primary" 
            className="bg-green-600 border-green-600"
            icon={<PlusCircleOutlined />}
            onClick={handleAddPaymentMethod}
          >
            Add New Payment Method
          </Button>
        </div>
        
        <div className="space-y-4">
          {paymentMethods.length === 0 ? (
            <Card className="text-center py-12">
              <CreditCardOutlined className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Payment Methods</h3>
              <p className="text-gray-500 mb-4">Add a payment method to make checkout faster</p>
              <Button 
                type="primary" 
                className="bg-green-600 border-green-600"
                icon={<PlusCircleOutlined />}
                onClick={handleAddPaymentMethod}
              >
                Add Payment Method
              </Button>
            </Card>
          ) : (
            paymentMethods.map((method) => (
              <Card key={method.id} size="small" className="border border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <CreditCardOutlined className="text-xl text-green-600" />
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-gray-500">
                        {method.number}
                        {method.expiryDate && ` • Expires ${method.expiryDate}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.isDefault && (
                      <Tag color="green">Default</Tag>
                    )}
                    {!method.isDefault && (
                      <Button 
                        size="small" 
                        type="link"
                        onClick={() => handleSetDefaultPayment(method.id)}
                        style={{ color: '#1890ff' }}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleEditPaymentMethod(method)} />
                    <Button size="small" icon={<DeleteOutlined />} danger onClick={() => handleDeletePaymentMethod(method)} />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>

      <Card className="shadow-sm border-0">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <DollarOutlined className="mr-2 text-green-600" />
          Payment History
        </h3>
        
        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card className="text-center py-12">
              <DollarOutlined className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Payment History</h3>
              <p className="text-gray-500">Your payment history will appear here after making purchases</p>
            </Card>
          ) : (
            orders.map((order) => (
              <div key={order.orderId} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">Order #{order.orderId}</p>
                  <p className="text-sm text-gray-500">{order.createdAt}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">₹{order.price}</p>
                  <Tag color={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Tag>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );

  const renderSettingsSection = () => (
    <div className="space-y-6">
      <Card className="shadow-sm border-0">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <SecurityScanOutlined className="mr-2 text-green-600" />
          Security Settings
        </h3>
        <div className="space-y-4">
          <Button 
            type="default" 
            icon={<LockOutlined />}
            className="w-full justify-start h-12 text-left"
            onClick={() => setPasswordModalVisible(true)}
          >
            Change Password
          </Button>
          <Button 
            type="default" 
            icon={<BellOutlined />}
            className="w-full justify-start h-12 text-left"
          >
            Notification Preferences
          </Button>
        </div>
      </Card>

      <Card className="shadow-sm border-0">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <EnvironmentOutlined className="mr-2 text-green-600" />
          Address Management
        </h3>
        <div className="space-y-4">
          <Button 
            type="default" 
            icon={<EnvironmentOutlined />} 
            className="w-full justify-start h-12 text-left" 
            onClick={() => openAddressModal()}
          >
            Add New Address
          </Button>
        </div>
      </Card>

      <Card className="shadow-sm border-0">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <HeartOutlined className="mr-2 text-green-600" />
          Preferences
        </h3>
        <div className="space-y-4">
          <Button 
            type="default" 
            icon={<HeartOutlined />}
            className="w-full justify-start h-12 text-left"
          >
            Wishlist
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="_container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className="profile-tabs"
          tabBarStyle={{ marginBottom: 24 }}
          tabBarExtraContent={undefined}
        >
          <TabPane 
            tab={
              <span className="flex items-center">
                <UserOutlined className="mr-2" />
                Profile
              </span>
            } 
            key="profile"
          >
            {renderProfileSection()}
          </TabPane>
          
          <TabPane 
            tab={
              <span className="flex items-center">
                <ShoppingOutlined className="mr-2" />
                Cart
                {totalQuantity > 0 && (
                  <Badge count={totalQuantity} className="ml-2" />
                )}
              </span>
            } 
            key="cart"
          >
            {renderCartSection()}
          </TabPane>
          
          <TabPane 
            tab={
              <span className="flex items-center">
                <ShoppingOutlined className="mr-2" />
                Orders
                {orders.length > 0 && (
                  <Badge count={orders.length} className="ml-2" />
                )}
              </span>
            } 
            key="orders"
          >
            {renderOrdersSection()}
          </TabPane>
          
          <TabPane 
            tab={
              <span className="flex items-center">
                <CreditCardOutlined className="mr-2" />
                Payments
              </span>
            } 
            key="payments"
          >
            {renderPaymentsSection()}
          </TabPane>
          
          <TabPane 
            tab={
              <span className="flex items-center">
                <SecurityScanOutlined className="mr-2" />
                Settings
              </span>
            } 
            key="settings"
          >
            {renderSettingsSection()}
          </TabPane>
        </Tabs>
      </div>

      {/* Password Change Modal */}
      <Modal
        title="Change Password"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
        width={400}
      >
        <Form
          form={passwordForm}
          onFinish={handlePasswordChange}
          layout="vertical"
        >
          <Form.Item
            name="oldPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter current password"
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter new password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter new password"
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm new password"
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          
          <Form.Item className="mb-0">
            <div className="flex justify-end space-x-3">
              <Button onClick={() => setPasswordModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} className="bg-green-600 border-green-600">
                Change Password
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Payment Method Modal */}
      <Modal
        title={editingPayment ? "Edit Payment Method" : "Add Payment Method"}
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={paymentForm}
          onFinish={handleSavePaymentMethod}
          layout="vertical"
        >
          <Form.Item
            name="type"
            label="Payment Type"
            rules={[{ required: true, message: 'Please select payment type' }]}
          >
            <Select placeholder="Select payment type">
              <Option value="card">Credit/Debit Card</Option>
              <Option value="upi">UPI</Option>
              <Option value="paypal">PayPal</Option>
              <Option value="peonio">Peonio</Option>
              <Option value="wallet">Digital Wallet</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="name"
            label="Payment Method Name"
            rules={[{ required: true, message: 'Please enter payment method name' }]}
          >
            <Input placeholder="e.g., HDFC Credit Card, PayPal Account" />
          </Form.Item>
          
          <Form.Item
            name="number"
            label="Account Number/ID"
            rules={[
              { required: true, message: 'Please enter account number or ID' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const type = getFieldValue('type');
                  if (type === 'upi' && value) {
                    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
                    if (!upiRegex.test(value)) {
                      return Promise.reject(new Error('Invalid UPI ID format'));
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="Card number, UPI ID, or account number" />
          </Form.Item>
          
          <Form.Item
            name="expiryDate"
            label="Expiry Date (for cards)"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const type = getFieldValue('type');
                  if (type === 'card') {
                    if (!value) {
                      return Promise.reject(new Error('Expiry date is required for cards'));
                    }
                    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
                    if (!expiryRegex.test(value)) {
                      return Promise.reject(new Error('Invalid expiry date format. Use MM/YY'));
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="MM/YY" />
          </Form.Item>
          
          <Form.Item
            name="cardType"
            label="Card Type (for cards)"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const type = getFieldValue('type');
                  if (type === 'card' && !value) {
                    return Promise.reject(new Error('Card type is required for cards'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Select placeholder="Select card type">
              <Option value="Visa">Visa</Option>
              <Option value="Mastercard">Mastercard</Option>
              <Option value="American Express">American Express</Option>
              <Option value="Discover">Discover</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="cvv"
            label="CVV (for cards)"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const type = getFieldValue('type');
                  if (type === 'card') {
                    if (!value) {
                      return Promise.reject(new Error('CVV is required for cards'));
                    }
                    if (!/^\d{3,4}$/.test(value)) {
                      return Promise.reject(new Error('CVV must be 3 or 4 digits'));
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="3 or 4 digits" maxLength={4} />
          </Form.Item>
          
          <Form.Item className="mb-0">
            <div className="flex justify-end space-x-3">
              <Button onClick={() => setPaymentModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" className="bg-green-600 border-green-600">
                {editingPayment ? "Update" : "Add"} Payment Method
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Payment Method Confirmation Modal */}
      <Modal
        title="Delete Payment Method"
        open={deleteModalVisible}
        onCancel={cancelDeletePayment}
        footer={[
          <Button key="cancel" onClick={cancelDeletePayment}>
            Cancel
          </Button>,
          <Button 
            key="delete" 
            type="primary" 
            danger 
            loading={deleteLoading}
            onClick={confirmDeletePayment}
          >
            Delete
          </Button>,
        ]}
        width={400}
      >
        <div className="text-center">
          <DeleteOutlined className="text-6xl text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Delete Payment Method</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete "{paymentToDelete?.name}"?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* Enhanced Order Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <ShoppingCartOutlined className="text-blue-500" />
            <span className="text-lg font-semibold">Place Order</span>
          </div>
        }
        open={orderModalVisible}
        onCancel={() => setOrderModalVisible(false)}
        footer={null}
        width={700}
        centered
      >
        <div className="space-y-6">
          {/* Order Summary Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <ShoppingCartOutlined className="text-blue-500 mr-2" />
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-semibold text-gray-800">{totalQuantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-800">₹{billAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="font-semibold text-gray-800">₹50</span>
              </div>
              <div className="border-t border-blue-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                  <span className="text-xl font-bold text-green-600">₹{billAmount + 50}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address Selection Section */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <EnvironmentOutlined className="text-green-500 mr-2" />
              Delivery Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Street Address"
                className="h-11"
                prefix={<EnvironmentOutlined className="text-gray-400" />}
              />
              <Input
                placeholder="City"
                className="h-11"
                prefix={<EnvironmentOutlined className="text-gray-400" />}
              />
              <Input
                placeholder="State/Province"
                className="h-11"
                prefix={<EnvironmentOutlined className="text-gray-400" />}
              />
              <Input
                placeholder="Postal Code"
                className="h-11"
                prefix={<EnvironmentOutlined className="text-gray-400" />}
              />
              <Input
                placeholder="Country"
                className="h-11 md:col-span-2"
                prefix={<EnvironmentOutlined className="text-gray-400" />}
              />
              <Input
                placeholder="Landmark (Optional)"
                className="h-11 md:col-span-2"
                prefix={<EnvironmentOutlined className="text-gray-400" />}
              />
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CreditCardOutlined className="text-purple-500 mr-2" />
              Payment Method
            </h3>
            {paymentMethods.length > 0 ? (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                        <CreditCardOutlined className="text-xl text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-800">{method.name}</h4>
                          {method.isDefault && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {method.type === 'card' && method.number && `•••• ${method.number.slice(-4)}`}
                          {method.type === 'upi' && method.number}
                          {method.type === 'wallet' && method.name}
                          {method.type === 'paypal' && 'PayPal Account'}
                          {method.type === 'peonio' && 'Peonio Wallet'}
                        </p>
                        {method.expiryDate && (
                          <p className="text-xs text-gray-400 mt-1">
                            Expires: {method.expiryDate}
                          </p>
                        )}
                      </div>
                      {selectedPaymentMethod === method.id && (
                        <CheckCircleOutlined className="text-blue-500 text-xl" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCardOutlined className="text-4xl text-gray-300 mb-3" />
                <h4 className="text-gray-600 font-medium mb-2">No Payment Methods</h4>
                <p className="text-sm text-gray-500 mb-4">
                  You haven't added any payment methods yet.
                </p>
                <Button 
                  type="primary" 
                  onClick={() => {
                    setOrderModalVisible(false);
                    // You can add logic here to open the payment methods section
                  }}
                  className="bg-blue-500 border-blue-500"
                >
                  Add Payment Method
                </Button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between space-x-3 pt-4">
            <Button 
              onClick={() => setOrderModalVisible(false)}
              size="large"
              className="h-12 px-8"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              onClick={handlePlaceOrder}
              loading={orderLoading}
              disabled={!selectedPaymentMethod}
              className="bg-green-600 border-green-600 h-12 px-8"
              size="large"
            >
              Place Order (₹{billAmount + 50})
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cart Item Deletion Confirmation Modal */}
      <Modal
        title="Remove Item"
        open={deleteCartItemModalVisible}
        onCancel={() => {
          setDeleteCartItemModalVisible(false);
          setItemToDelete(null);
        }}
        onOk={confirmDeleteCartItem}
        okText="Remove"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        width={400}
      >
        <div className="text-center">
          <DeleteOutlined className="text-4xl text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Remove Item from Cart?</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to remove "{itemToDelete?.product?.name}" from your cart?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* Address Management Modal */}
      <Modal
        open={addressModalVisible} // use 'open' instead of 'visible'
        onCancel={() => {
          setAddressModalVisible(false);
          setEditingAddress(null);
          addressForm.resetFields();
        }}
        footer={null}
        title={editingAddress ? "Edit Address" : "Add Address"}
      >
        <Form
          form={addressForm}
          layout="vertical"
          initialValues={editingAddress || undefined}
        >
          <Form.Item name="country" label="Country" rules={[{ required: true, message: 'Please enter country' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true, message: 'Please enter city' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="street" label="Street Name" rules={[{ required: true, message: 'Please enter street name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="postalCode" label="Postal Code" rules={[{ required: true, message: 'Please enter postal code' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="landmark" label="Nearby Buildings / Landmarks (optional)">
            <Input />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => {
                setAddressModalVisible(false);
                setEditingAddress(null);
                addressForm.resetFields();
              }}>Cancel</Button>
              <Button type="primary" onClick={handleSaveAddress} className="bg-green-600 border-green-600">
                {editingAddress ? 'Update' : 'Add'} Address
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modern Address List Section (inside Settings Tab, below the button) */}
      {addresses.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Saved Addresses</h3>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="bg-green-600 border-green-600"
              onClick={() => openAddressModal()}
            >
              Add Address
            </Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {addresses.map(addr => (
              <Card
                key={addr.key}
                style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', background: '#fff', position: 'relative' }}
                bodyStyle={{ padding: 24 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <EnvironmentOutlined style={{ fontSize: 32, color: '#0c831f', flexShrink: 0, marginTop: 4 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{addr.street}, {addr.city}</div>
                    <div style={{ color: '#555', fontSize: 15 }}>{addr.country} • {addr.postalCode}</div>
                    {addr.landmark && (
                      <div style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
                        <span style={{ fontWeight: 500 }}>Landmark:</span> {addr.landmark}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 8 }}>
                    <Button
                      type="text"
                      icon={<EditOutlined style={{ fontSize: 18 }} />}
                      onClick={() => openAddressModal(addr)}
                      style={{ color: '#1890ff' }}
                      aria-label="Edit address"
                    />
                    <Button
                      type="text"
                      icon={<DeleteOutlined style={{ fontSize: 18 }} />}
                      onClick={() => handleDeleteAddress(addr.key)}
                      style={{ color: '#ff4d4f' }}
                      aria-label="Delete address"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 