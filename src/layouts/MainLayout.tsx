import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isHome, setIsHome] = useState(false);
  
  useEffect(() => {
    const pathname = window.location.pathname;
    console.log('pathname: ', pathname);
    setIsHome(pathname === '/dashboard');
  }, [window.location.pathname]);

  return (
    <Layout>
      <Sidebar collapsed={collapsed} />
      <Layout className={`${collapsed ? 'ml-20' : 'ml-[220px]'}`}>
        <Header
          collapsed={collapsed}
          onCollapse={setCollapsed}
        />
        <Content className={`${isHome ? '' : 'p-6'} min-h-screen bg-[#f5f5f5]`}>
          <div className={`${isHome ? '' : 'p-6'} bg-white min-h-full rounded h-[calc(100vh-140px)] overflow-auto`}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;