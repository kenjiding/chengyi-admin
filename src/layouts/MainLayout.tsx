import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sidebar collapsed={collapsed} />
      <Layout className={`${collapsed ? 'ml-20' : 'ml-[220px]'}`}>
        <Header
          collapsed={collapsed}
          onCollapse={setCollapsed}
        />
        <Content className="p-6 min-h-screen bg-[#f5f5f5]">
          <div className="bg-white p-6 min-h-full rounded h-[calc(100vh-140px)] overflow-auto">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;