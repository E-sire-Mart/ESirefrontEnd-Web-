import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Space, notification, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { getOrders } from "../../services/api/order";
import axios from "axios";
import { BASE_URL } from "../../services/url";
import "./style.css";

interface OrderProps {
  toggleOrderModal: () => void;
  onOrderSuccess: () => void;
}

interface ProductItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  shopId: string;
  shopName: string;
  productItems: ProductItem[];
  orderStatus: string;
}

interface OrderType {
  orderId: string;
  shopName: string;
  products: ProductItem[];
  price: number;
  status: string;
  createdAt: string;
}

const Order: React.FC<OrderProps> = ({ toggleOrderModal, onOrderSuccess }) => {
  const [orderData, setOrderData] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const CustomButton = ({ label, onClick, color, loading, disabled }: any) => {
    return (
      <button
        onClick={onClick}
        disabled={loading || disabled}
        className={`py-1 w-[90px] rounded-[5px] flex justify-center items-center cursor-pointer 
          ${color} ${
          loading || disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        ) : (
          label
        )}
      </button>
    );
  };

  const columns: ColumnsType<OrderType> = [
    {
      title: "Order Id",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Shop Name",
      dataIndex: "shopName",
      key: "shopName",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (items: ProductItem[]) =>
        items.map((item) => (
          <div key={item.productId} className="product-item">
            {item.productName} - ₹{item.price} x {item.quantity}
          </div>
        )),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (amount) => `₹${amount}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (status === "Shipped" ? "Out for delivery" : status),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (date) => new Date(date).toLocaleString(), // Format the date as needed
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (record) => (
        <div className="flex flex-col gap-[5px]">
          {record.status === "Created" && (
            <CustomButton
              label="Cancel"
              onClick={(e: any) => handleCancelOrder(record.orderId, e)}
              color="bg-red-500 hover:bg-red-600 text-white"
              loading={loadingStates[record.orderId] || false}
              disabled={loadingStates[record.orderId] || false}
            />
          )}

          {record.status === "Delivered" && (
            <CustomButton
              label="Complete"
              onClick={() => handleCompleteOrder(record.orderId)}
              color="bg-green-500 hover:bg-green-600 text-white"
              loading={loadingStates[record.orderId] || false}
              disabled={loadingStates[record.orderId] || false}
            />
          )}

          {record.status === "Delivered" && (
            <CustomButton
              label="Refund"
              onClick={() => handleRefundRequestOrder(record.orderId)}
              color="bg-yellow-500 hover:bg-yellow-600 text-white"
              loading={loadingStates[record.orderId] || false}
              disabled={loadingStates[record.orderId] || false}
            />
          )}

          {record.status === "Cancelled" || record.status === "Delivered" ? (
            <CustomButton
              label="Delete"
              onClick={() => handleDeleteOrder(record.orderId)}
              color="bg-gray-500 hover:bg-gray-600 text-white"
              loading={loadingStates[record.orderId] || false}
              disabled={loadingStates[record.orderId] || false}
            />
          ) : null}

          {record.status === "Refund Approved" && (
            <CustomButton
              label="Delete"
              onClick={() => handleDeleteOrder(record.orderId)}
              color="bg-gray-500 hover:bg-gray-600 text-white"
              loading={loadingStates[record.orderId] || false}
              disabled={loadingStates[record.orderId] || false}
            />
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string, e: any) => {
    setLoadingStates((prevState) => ({ ...prevState, [orderId]: true }));

    const userData = localStorage.getItem("user");

    if (userData) {
      const token = JSON.parse(userData).access_token;
      const data = JSON.stringify({
        orderId,
      });

      try {
        const response = await axios.put(
          `${BASE_URL}/orders/cancelOrder`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          await fetchOrders();

          notification.success({
            message: response.data.message,
          });
        }
      } catch (error) {
        notification.error({
          message: "Failed to cancel order.",
        });
      } finally {
        setLoadingStates((prevState) => ({ ...prevState, [orderId]: false }));
      }
    }
  };

  const handleRefundRequestOrder = async (orderId: string) => {
    setLoadingStates((prevState) => ({ ...prevState, [orderId]: true }));

    const userData = localStorage.getItem("user");

    if (userData) {
      const token = JSON.parse(userData).access_token;
      const data = JSON.stringify({
        orderId,
      });

      try {
        const response = await axios.put(
          `${BASE_URL}/orders/refundRequestOrder`, // Example API endpoint for refund
          data,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          await fetchOrders(); // Refetch orders after successful refund

          notification.success({
            message: response.data.message,
          });
        }
      } catch (error) {
        notification.error({
          message: "Failed to process refund.",
        });
      } finally {
        setLoadingStates((prevState) => ({ ...prevState, [orderId]: false }));
      }
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    setLoadingStates((prevState) => ({ ...prevState, [orderId]: true }));

    const userData = localStorage.getItem("user");

    if (userData) {
      const token = JSON.parse(userData).access_token;
      const data = JSON.stringify({
        orderId,
      });

      try {
        const response = await axios.put(
          `${BASE_URL}/orders/completeOrder`, // Example API endpoint for marking the order as complete
          data,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          await fetchOrders(); // Refetch orders after successful completion

          notification.success({
            message: response.data.message,
          });
        }
      } catch (error) {
        notification.error({
          message: "Failed to complete order.",
        });
      } finally {
        setLoadingStates((prevState) => ({ ...prevState, [orderId]: false }));
      }
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setLoadingStates((prevState) => ({ ...prevState, [orderId]: true }));

    const userData = localStorage.getItem("user");

    if (userData) {
      const token = JSON.parse(userData).access_token;

      try {
        const response = await axios.delete(
          `${BASE_URL}/orders/deleteOrder/${orderId}`, // Example API endpoint for deleting an order
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          await fetchOrders(); // Refetch orders after successful deletion

          notification.success({
            message: response.data.message,
          });
        }
      } catch (error) {
        notification.error({
          message: "Failed to delete order.",
        });
      } finally {
        setLoadingStates((prevState) => ({ ...prevState, [orderId]: false }));
      }
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      const ordersData: any[] = data.map((item: any) => {
        const products = item.items.map((product: any) => {
          return {
            productId: product.productId._id,
            productName: product.productId.name,
            price: product.price,
            quantity: product.quantity,
          };
        });

        return {
          orderId: item.razorpay_order_id,
          shopName: item.shopId.name,
          products,
          price: item.totalPrice,
          status: item.status,
          createdAt: item.created_at.toLocaleString(),
        };
      });
      setLoading(false);
      setOrderData(ordersData);
    } catch (error: any) {
      console.log();
      const errorStatus = error.response.status;

      if (errorStatus === 401) {
        notification.error({
          message: "Get Orders Failed!",
        });
        notification.error({
          message: "Please login again!",
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setLoading(false);
        window.location.reload();
        return;
      }

      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-Order">
        <button
          className="modal-close"
          onClick={toggleOrderModal}
          style={{ color: "#70b55d" }}
        >
          ×
        </button>
        <div className="modal-header">
          <h2 style={{ color: "#70b55d" }}>My Orders</h2>
        </div>

        <div className="order-form">
          <Table
            columns={columns}
            dataSource={orderData}
            rowKey="orderId"
            pagination={false}
            bordered
            size="middle"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Order;
