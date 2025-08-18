import React from 'react';
import { Card, Button } from 'antd';
import { ShopOutlined } from '@ant-design/icons';

const RegisterStore: React.FC = () => {
  return (
    <div className="_container py-10">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Register Your Store</h1>
            <ShopOutlined className="text-2xl text-green-600" />
          </div>
          <p className="text-gray-600 mb-6">
            This is a placeholder page. Implement your seller/store onboarding form here.
          </p>
          <Button type="primary" className="bg-green-600 border-green-600">Get Started</Button>
        </Card>
      </div>
    </div>
  );
};

export default RegisterStore;



