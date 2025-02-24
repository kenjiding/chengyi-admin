import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <p className="text-xl text-gray-600 mt-4 mb-8">
          抱歉，您访问的页面不存在
        </p>
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;