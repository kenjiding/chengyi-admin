import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Tag, Modal, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { IBanner } from '@/types/banner';
import BannerForm from '@/components/BannerForm';
import { getBanners, deleteBanner } from '@/api/banner';
import { getUrl } from '@/lib/utils';

const BannerList: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);
  const [loading, setLoading] = useState(false); // 用于控制 Table 和 Modal 的加载状态
  const [banners, setBanners] = useState<IBanner[]>([]);
  const formRef = useRef<{ resetForm: () => void } | null>(null);

  // 页面加载时获取数据
  useEffect(() => {
    fetchBanners();
  }, []);

  // 获取轮播图数据的函数，增加了错误边界和加载状态管理
  const fetchBanners = async () => {
    try {
      setLoading(true); // 开始加载时设置为 true，Table 会显示 loading 动画
      const data = await getBanners(); // 调用 API 获取数据
      setBanners(data); // 更新数据状态
    } catch (error) {
      // 更详细的错误处理，可以根据需要自定义
      console.error('Failed to fetch banners:', error);
      message.error('获取轮播图列表失败，请稍后重试');
      setBanners([]); // 失败时清空数据，避免显示旧数据
    } finally {
      setLoading(false); // 无论成功或失败，加载完成后设置为 false
    }
  };

  const columns: ColumnsType<IBanner> = [
    {
      title: '排序',
      dataIndex: 'order',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '副标题',
      dataIndex: 'subtitle',
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'video' ? 'blue' : 'green'}>
          {type === 'video' ? '视频' : '图片'}
        </Tag>
      ),
    },
    {
      title: '预览',
      dataIndex: 'media',
      width: 120,
      render: (media: string, record: IBanner) => (
        record.type === 'image' ? (
          <img src={getUrl(media)} alt={record.title} className="w-20 h-12 object-cover rounded" />
        ) : (
          <video className="w-20 h-12 object-cover rounded">
            <source src={media} type="video/mp4" />
          </video>
        )
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个轮播图吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (banner: IBanner) => {
    setEditingBanner(banner);
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true); // 删除时也显示加载状态
      await deleteBanner(id);
      message.success('删除成功');
      await fetchBanners(); // 删除后重新加载数据
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setEditingBanner(null);
    setVisible(true);
    if (formRef.current) {
      formRef.current.resetForm();
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // 保存逻辑已在 BannerForm 中实现，这里只处理状态更新
      message.success('保存成功');
      setVisible(false);
      setEditingBanner(null);
      await fetchBanners(); // 保存后刷新列表
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-medium">轮播图管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
        >
          添加轮播图
        </Button>
      </div>

      {/* Table 组件，使用 loading 状态 */}
      <Table
        columns={columns}
        dataSource={banners}
        rowKey="id"
        pagination={false}
        loading={loading} // 绑定 loading 状态，数据加载时显示 spinner
      />

      <Modal
        title={editingBanner ? '编辑轮播图' : '添加轮播图'}
        open={visible}
        onCancel={() => {
          setVisible(false);
          setEditingBanner(null);
        }}
        footer={null}
        width={800}
      >
        <BannerForm
          ref={formRef}
          initialValues={editingBanner}
          onSave={handleSave}
          onCancel={() => setVisible(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default BannerList;