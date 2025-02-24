import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  UserOutlined, 
  ShoppingCartOutlined,
  DollarOutlined,
  ShoppingOutlined 
} from '@ant-design/icons';
// import { DashboardChart } from '@/components/DashboardChart';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <Statistic
              title="总用户数"
              value={11283}
              prefix={<UserOutlined />}
              className="text-blue-500"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <Statistic
              title="商品总数"
              value={9343}
              prefix={<ShoppingOutlined />}
              className="text-green-500"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <Statistic
              title="订单总数"
              value={1232}
              prefix={<ShoppingCartOutlined />}
              className="text-purple-500"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="hover:shadow-lg transition-shadow">
            <Statistic
              title="总收入"
              value={234232}
              prefix={<DollarOutlined />}
              className="text-red-500"
            />
          </Card>
        </Col>
      </Row>

      <div className="mt-6">
        <Card title="销售趋势" className="shadow-sm">
          {/* <DashboardChart /> */}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;