import React, { useState } from 'react';
import { Modal, Button, Select, Form, Input, Card, Divider, notification, Steps } from 'antd';
import { EnvironmentOutlined, CreditCardOutlined, ShoppingCartOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Step } = Steps;

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet' | 'paypal' | 'peonio';
  name: string;
  number?: string;
  isDefault: boolean;
  expiryDate?: string;
  cardType?: string;
}

interface OrderModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (orderData: any) => void;
  billAmount: number;
  totalQuantity: number;
  paymentMethods: PaymentMethod[];
  loading?: boolean;
}

const OrderModal: React.FC<OrderModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  billAmount,
  totalQuantity,
  paymentMethods,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    landmark: ''
  });

  const deliveryFee = 50;
  const totalAmount = billAmount + deliveryFee;

  const handleAddressSubmit = (values: any) => {
    setAddressData(values);
    setCurrentStep(1);
  };

  const handlePaymentSubmit = () => {
    if (!selectedPaymentMethod) {
      notification.error({
        message: 'Payment Method Required',
        description: 'Please select a payment method to continue.'
      });
      return;
    }

    const orderData = {
      address: addressData,
      paymentMethod: selectedPaymentMethod,
      orderSummary: {
        totalItems: totalQuantity,
        subtotal: billAmount,
        deliveryFee,
        totalAmount
      }
    };

    onConfirm(orderData);
  };

  const handleCancel = () => {
    setCurrentStep(0);
    setSelectedPaymentMethod('');
    form.resetFields();
    onCancel();
  };

  const steps = [
    {
      title: 'Address',
      icon: <EnvironmentOutlined />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <EnvironmentOutlined className="text-3xl text-blue-500 mb-2" />
            <h3 className="text-xl font-semibold text-gray-800">Delivery Address</h3>
            <p className="text-gray-600">Please provide your delivery address</p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddressSubmit}
            initialValues={addressData}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="street"
                label="Street Address"
                rules={[{ required: true, message: 'Please enter street address' }]}
              >
                <Input placeholder="Enter your street address" />
              </Form.Item>

              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter city' }]}
              >
                <Input placeholder="Enter your city" />
              </Form.Item>

              <Form.Item
                name="state"
                label="State/Province"
                rules={[{ required: true, message: 'Please enter state' }]}
              >
                <Input placeholder="Enter your state" />
              </Form.Item>

              <Form.Item
                name="postalCode"
                label="Postal Code"
                rules={[{ required: true, message: 'Please enter postal code' }]}
              >
                <Input placeholder="Enter postal code" />
              </Form.Item>

              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: true, message: 'Please enter country' }]}
              >
                <Input placeholder="Enter your country" />
              </Form.Item>

              <Form.Item
                name="landmark"
                label="Landmark (Optional)"
              >
                <Input placeholder="Nearby landmark or building" />
              </Form.Item>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" className="bg-blue-500 border-blue-500">
                Continue to Payment
              </Button>
            </div>
          </Form>
        </div>
      )
    },
    {
      title: 'Payment',
      icon: <CreditCardOutlined />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <CreditCardOutlined className="text-3xl text-green-500 mb-2" />
            <h3 className="text-xl font-semibold text-gray-800">Payment Method</h3>
            <p className="text-gray-600">Choose your preferred payment method</p>
          </div>

                     {paymentMethods.length > 0 ? (
             <div className="space-y-3">
               {paymentMethods.map((method) => (
                 <Card
                   key={method.id}
                   className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
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
                 </Card>
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
                   onCancel();
                   // You can add logic here to open the payment methods section
                 }}
                 className="bg-blue-500 border-blue-500"
               >
                 Add Payment Method
               </Button>
             </div>
           )}

          <div className="flex justify-between space-x-3 mt-6">
            <Button onClick={() => setCurrentStep(0)}>
              Back to Address
            </Button>
            <Button 
              type="primary" 
              onClick={handlePaymentSubmit}
              loading={loading}
              disabled={!selectedPaymentMethod}
              className="bg-green-500 border-green-500"
            >
              Review Order
            </Button>
          </div>
        </div>
      )
    },
    {
      title: 'Review',
      icon: <ShoppingCartOutlined />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <ShoppingCartOutlined className="text-3xl text-purple-500 mb-2" />
            <h3 className="text-xl font-semibold text-gray-800">Order Review</h3>
            <p className="text-gray-600">Review your order details before confirming</p>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-4">Order Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium">{totalQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${billAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="font-medium">${deliveryFee}</span>
              </div>
              <Divider className="my-3" />
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                <span className="text-lg font-bold text-green-600">${totalAmount}</span>
              </div>
            </div>
          </Card>

          <Card className="border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Delivery Address</h4>
            <div className="text-gray-600 space-y-1">
              <p>{addressData.street}</p>
              <p>{addressData.city}, {addressData.state} {addressData.postalCode}</p>
              <p>{addressData.country}</p>
              {addressData.landmark && <p>Landmark: {addressData.landmark}</p>}
            </div>
          </Card>

                     <Card className="border-gray-200">
             <h4 className="font-semibold text-gray-800 mb-3">Payment Method</h4>
             <div className="flex items-center space-x-2">
               <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                 <CreditCardOutlined className="text-lg text-gray-600" />
               </div>
               <span className="text-gray-700">
                 {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
               </span>
             </div>
           </Card>

          <div className="flex justify-between space-x-3">
            <Button onClick={() => setCurrentStep(1)}>
              Back to Payment
            </Button>
            <Button 
              type="primary" 
              onClick={handlePaymentSubmit}
              loading={loading}
              className="bg-green-500 border-green-500"
              size="large"
            >
              Confirm Order (${totalAmount})
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <ShoppingCartOutlined className="text-blue-500" />
          <span className="text-lg font-semibold">Place Order</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      centered
    >
      <div className="mb-6">
        <Steps current={currentStep} size="small">
          {steps.map((step, index) => (
            <Step
              key={index}
              title={step.title}
              icon={step.icon}
            />
          ))}
        </Steps>
      </div>

      <div className="min-h-[400px]">
        {steps[currentStep].content}
      </div>
    </Modal>
  );
};

export default OrderModal;
