import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Spin, notification, Result } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { verifyEmail } from '../services/api/auth';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    console.log(token, '-----------------')
    if (!token) {
      setVerificationStatus('error');
      setErrorMessage('Invalid verification link. No token provided.');
      return;
    }

    const handleVerification = async () => {
      try {
        await verifyEmail(token);
        setVerificationStatus('success');
        notification.success({
          message: 'Email Verified Successfully!',
          description: 'Your email has been verified. You can now log in to your account.',
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error: any) {
        setVerificationStatus('error');
        setErrorMessage(
          error.response?.data?.message || 
          'Email verification failed. Please try again or contact support.'
        );
        notification.error({
          message: 'Verification Failed',
          description: 'Unable to verify your email. Please try again.',
        });
      }
    };

    handleVerification();
  }, [searchParams, navigate]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <Result
            icon={<LoadingOutlined style={{ color: '#06A67E' }} />}
            title="Verifying your email..."
            subTitle="Please wait while we verify your email address."
            extra={
              <Spin 
                indicator={<LoadingOutlined style={{ fontSize: 24, color: '#06A67E' }} spin />} 
                size="large"
              />
            }
          />
        );
      
      case 'success':
        return (
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: '#06A67E' }} />}
            title="Email Verified Successfully!"
            subTitle="Your email has been verified. You will be redirected to the login page shortly."
            extra={[
              <button
                key="login"
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-[#06A67E] text-white rounded-lg hover:bg-opacity-90 transition duration-300"
              >
                Go to Login
              </button>
            ]}
          />
        );
      
      case 'error':
        return (
          <Result
            status="error"
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            title="Verification Failed"
            subTitle={errorMessage}
            extra={[
              <button
                key="home"
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-[#06A67E] text-white rounded-lg hover:bg-opacity-90 transition duration-300"
              >
                Go to Home
              </button>
            ]}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerification; 