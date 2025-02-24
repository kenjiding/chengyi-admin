import React from 'react';
import { Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const UserInfo: React.FC = () => {
  const navigate = useNavigate();

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人信息'
    },
    {
      key: 'settings',
      label: '系统设置'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: '退出登录',
      onClick: () => navigate('/login')
    }
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <div className="flex items-center cursor-pointer">
        <Avatar icon={<UserOutlined />} />
        <span className="ml-2">Admin User</span>
      </div>
    </Dropdown>
  );
};

export default UserInfo;