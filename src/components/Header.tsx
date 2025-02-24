import React from 'react';
import { Layout, Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useStore from '@/store';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onCollapse }) => {
  const logout = useStore(state => state.logout);
  const userInfo = useStore(state => state.userInfo);
  const navigate = useNavigate();

  const items: MenuProps['items'] = [
    // {
    //   key: 'profile',
    //   label: '个人信息'
    // },
    {
      key: 'logout',
      label: '退出登录',
      onClick: () => {
        logout();
        navigate('/login');
      }
    }
  ];

  return (
    <AntHeader 
      style={{ 
        padding: 0, 
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div className="flex items-center">
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'text-lg p-4 cursor-pointer hover:text-blue-500',
          onClick: () => onCollapse(!collapsed),
        })}
      </div>
      <div className="px-4">
        <Dropdown menu={{ items }} placement="bottomRight">
          <div className="flex items-center cursor-pointer">
            <Avatar icon={<UserOutlined />} />
            <span className="ml-2">{userInfo?.username}</span>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;