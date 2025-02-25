import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  SettingOutlined,
  PictureOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();

  const menuItems = [
    // {
    //   key: '/dashboard',
    //   icon: <DashboardOutlined />,
    //   label: <Link to="/dashboard">仪表盘</Link>
    // },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: <Link to="/products">商品管理列表</Link>
    },
    {
      key: '/brandCategoryManager',
      icon: <PictureOutlined />,
      label: <Link to="/brandCategoryManager">品牌类别管理</Link>
    },
    {
      key: '/collaboration',
      icon: <PictureOutlined />,
      label: <Link to="/collaboration">合作品牌管理</Link>
    },
    {
      key: '/banner',
      icon: <PictureOutlined />,
      label: <Link to="/banner">Banner管理</Link>
    },
    {
      key: '/news',
      icon: <PictureOutlined />,
      label: <Link to="/news">新闻管理</Link>
    },
    // {
    //   key: '/users',
    //   icon: <UserOutlined />,
    //   label: <Link to="/users">用户管理</Link>
    // },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">系统设置</Link>
    }
  ];

  return (
    <Sider 
      trigger={null}
      collapsible 
      collapsed={collapsed}
      width={220}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: '#001529'
      }}
    >
      <div className="h-16 flex items-center justify-center text-white text-lg">
        {collapsed ? 'AMS' : '成益管理系统'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['products']}
        items={menuItems}
        style={{ 
          background: '#001529',
          borderRight: 'none'
        }}
      />
    </Sider>
  );
};

export default Sidebar;