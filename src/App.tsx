import React from 'react';
import { ConfigProvider, message } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import zhCN from 'antd/locale/zh_CN';
import { Router } from './router';
import './index.css';
import { initMessage } from './lib/utils';

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  React.useEffect(() => {
    initMessage(messageApi);
  }, [messageApi]);

  return (
    <ConfigProvider locale={zhCN}>
      {contextHolder}
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;