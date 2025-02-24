import { useEffect, useState } from 'react';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Tabs, ConfigProvider } from 'antd';
import type { TabsProps, FormProps } from 'antd';
import { login, register } from '@/api/auth';
import { messageApi } from '@/lib/utils';
import { IUserInfo } from '@/types/user';
import { useNavigate } from 'react-router-dom';
import useStore from '@/store';

const AuthPage = () => {
  const navigate = useNavigate();
  const setUserInfo = useStore(state => state.setUserInfo);
  const token = useStore(state => state.token);
  const [activeTab, setActiveTab] = useState<string>('1');
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) navigate('/', { replace: true });
  }, []);

  const onFinish: FormProps<IUserInfo>['onFinish'] = async (values) => {
    console.log(activeTab, 'values: ', values);
    try {
      setLoading(true);
      if (activeTab === '1') {
        // 登录逻辑
        const userData = await login(values);
        setUserInfo(userData);
        messageApi.success(`欢迎回来，${values.username}!`);
        navigate('/');
      } else {
        await register(values);
        // 注册逻辑
        messageApi.success('注册成功，请登录！');
        setActiveTab('1');
        registerForm.resetFields();
        loginForm.resetFields();
      }
    } catch (error: any) {
      console.log('error: ', error);
      const errText = `${activeTab === '1' ? '登录失败' : '注册失败'}, ${error.message}`
      messageApi.error(errText);
    } finally {
      setLoading(false);
    }
  };

  // 浅蓝色主题配置
  const themeConfig = {
    token: {
      colorPrimary: '#7DD3FC',
      borderRadius: 14,
    },
    components: {
      Input: {
        hoverBorderColor: '#38BDF8',
        activeBorderColor: '#38BDF8',
      },
      Tabs: {
        itemActiveColor: '#0EA5E9',
        itemHoverColor: '#38BDF8',
        inkBarColor: '#7DD3FC',
      }
    }
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '登录',
      children: (
        <Form
          form={loginForm}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-6"
          name="loginForm"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400/80 text-lg !mr-2" />}
              placeholder="用户名"
              className="h-12 rounded-xl border-sky-100 hover:border-sky-200 focus:border-sky-400"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400/80 text-lg !mr-2" />}
              placeholder="密码"
              className="h-12 rounded-xl border-sky-100 hover:border-sky-200"
            />
          </Form.Item>

          <div className="flex justify-between items-center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-gray-500">记住登录</Checkbox>
            </Form.Item>
            <a href="#" className="text-sky-500 hover:text-sky-600 transition-colors">
              忘记密码?
            </a>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="h-12 rounded-xl text-lg font-medium bg-gradient-to-r from-[#7DD3FC] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#0EA5E9] transition-all shadow-sky-200 hover:shadow-sky-300"
          >
            立即登录
          </Button>
        </Form>
      ),
    },
    {
      key: '2',
      label: '注册',
      children: (
        <Form
          form={registerForm}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-6"
          name="registerForm"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 4, message: '用户名至少4个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400/80 text-lg !mr-2" />}
              placeholder="用户名"
              className="h-12 rounded-xl border-sky-100 hover:border-sky-200"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { type: 'email', message: '邮箱格式不正确' }
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400/80 text-lg !mr-2" />}
              placeholder="邮箱"
              className="h-12 rounded-xl border-sky-100 hover:border-sky-200"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400/80 text-lg !mr-2" />}
              placeholder="密码"
              className="h-12 rounded-xl border-sky-100 hover:border-sky-200"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400/80 text-lg !mr-2" />}
              placeholder="确认密码"
              className="h-12 rounded-xl border-sky-100 hover:border-sky-200"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="h-12 rounded-xl text-lg font-medium bg-gradient-to-r from-[#7DD3FC] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#0EA5E9] transition-all shadow-sky-200 hover:shadow-sky-300"
          >
            立即注册
          </Button>
        </Form>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC]">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-[0_15px_50px_-10px_rgba(96,165,250,0.3)]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#7DD3FC] to-[#0EA5E9] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-100">
            <UserOutlined className="text-2xl text-white/90" />
          </div>
          <h1 className="text-3xl font-bold text-sky-800 mb-2">成益管理系统</h1>
          {/* <p className="text-sky-600/80">安全可靠的云端管理平台</p> */}
        </div>

        <ConfigProvider theme={themeConfig}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              loginForm.resetFields();
              registerForm.resetFields();
            }}
            items={items}
            centered
            className="[&_.ant-tabs-tab]:text-gray-500 [&_.ant-tabs-tab]:font-medium [&_.ant-tabs-tab:hover]:text-[#38BDF8] [&_.ant-tabs-tab-active]:text-[#0EA5E9]"
          />
        </ConfigProvider>

        <div className="mt-8 text-center text-sm">
          <span className="text-sky-600/80">
            {activeTab === '1' ? '首次使用? ' : '已有账号? '}
          </span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const newTab = activeTab === '1' ? '2' : '1';
              setActiveTab(newTab);
              loginForm.resetFields();
              registerForm.resetFields();
            }}
            className="text-sky-600 font-medium hover:text-sky-700 transition-colors"
          >
            {activeTab === '1' ? '创建新账户' : '返回登录'}
          </a>
        </div>
      </div>
      <style>
        {
          `.ant-tabs-nav::before {
           border-bottom: none !important;
         }`
        }
      </style>
    </div>
  );
};

export default AuthPage;