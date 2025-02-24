// app/admin/news/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Popconfirm,
  Form,
  Input,
  Select,
  Pagination,
  Row,
  Col,
  Radio,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { News } from '@/types/news';
import ImageUploader from '@/components/ImageUploader';
import { getNews, deleteNews, createNews, updateNews } from '@/api/news';
import { getUrl } from '@/lib/utils';

const NewsManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(false); // 用于 Modal 保存时的 loading
  const [tableLoading, setTableLoading] = useState(false); // 用于 Table 的 loading
  const [news, setNews] = useState<News[]>([]);
  const [imageList, setImageList] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<{
    title?: string;
    type?: 'news' | 'event';
  }>({});

  // 获取新闻列表
  const fetchNews = async () => {
    try {
      setTableLoading(true);
      const { items, pagination: paginationData } = await getNews({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      });
      setNews(items);
      setPagination(prev => ({
        ...prev,
        total: paginationData.totalCount,
      }));
    } catch (error) {
      message.error('获取新闻列表失败');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [pagination.current, pagination.pageSize, searchParams]);

  // 表格列配置
  const columns: ColumnsType<News> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '是否置顶',
      dataIndex: 'top',
      key: 'top',
      width: 100,
      render: (val: boolean) => (val ? '是' : '否'),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'event' ? 'blue' : 'green'}>
          {type === 'event' ? '活动' : '新闻'}
        </Tag>
      ),
    },
    {
      title: '预览图',
      dataIndex: 'imageUrl',
      width: 120,
      render: (imageUrl: string) => (
        imageUrl && (
          <img
            src={getUrl(imageUrl)}
            alt="新闻图片"
            className="w-20 h-12 object-cover rounded"
          />
        )
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这条新闻吗?"
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

  // 编辑处理
  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setVisible(true);
    setImageList(newsItem.imageUrl ? [newsItem.imageUrl] : []);
    form.setFieldsValue(newsItem);
  };

  // 删除处理
  const handleDelete = async (id: number) => {
    try {
      setTableLoading(true); // 删除时显示 Table 的 loading
      await deleteNews(id);
      message.success('删除成功');
      await fetchNews();
    } catch (error) {
      message.error('删除失败');
    } finally {
      setTableLoading(false);
    }
  };

  // 打开新增模态框
  const handleOpenModal = () => {
    setEditingNews(null);
    setVisible(true);
    setImageList([]);
    form.resetFields();
  };

  // 保存处理
  const handleSave = async (values: any) => {
    try {
      setLoading(true); // Modal 保存时的 loading
      const submitData = {
        ...values,
        imageUrl: imageList[0],
      };

      if (editingNews) {
        await updateNews(editingNews.id, submitData);
      } else {
        await createNews(submitData);
      }

      message.success('保存成功');
      setVisible(false);
      setEditingNews(null);
      await fetchNews(); // 刷新数据，触发 tableLoading
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 图片变更处理
  const handleImageChange = (list: string[]) => {
    setImageList(list);
    form.setFieldValue('imageUrl', list.toString());
  };

  // 搜索处理
  const handleSearch = (values: any) => {
    const params = {
      title: values.title || undefined,
      type: values.type || undefined,
    };
    setSearchParams(params);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 分页处理
  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  return (
    <div className="p-6">
      {/* 搜索区域 */}
      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        className="mb-4"
      >
        <Form.Item name="title">
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item name="type">
          <Select placeholder="选择类型" style={{ width: 120 }} allowClear>
            <Select.Option value="news">新闻</Select.Option>
            <Select.Option value="event">活动</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
            搜索
          </Button>
        </Form.Item>
      </Form>

      {/* 操作区域 */}
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-medium">新闻管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
          添加新闻
        </Button>
      </div>

      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={news}
        rowKey="id"
        loading={tableLoading} // 使用 tableLoading 控制 Table 的加载状态
        pagination={false}
        scroll={{
          y: 'calc(100vh - 300px)',
          x: 1200,
        }}
        className="shadow-sm"
      />

      {/* 分页 */}
      <div className="flex justify-center">
        <Pagination
          className="mt-4"
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) =>
            handleTableChange({ current: page, pageSize, total: pagination.total })
          }
          showSizeChanger
          showQuickJumper
          showTotal={total => `共 ${total} 条记录`}
        />
      </div>

      {/* 新增/编辑模态框 */}
      <Modal
        title={editingNews ? '编辑新闻' : '添加新闻'}
        open={visible}
        onCancel={() => {
          setVisible(false);
          setEditingNews(null);
        }}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="标题"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input placeholder="请输入新闻标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="类型"
                rules={[{ required: true, message: '请选择类型' }]}
              >
                <Select placeholder="选择新闻类型">
                  <Select.Option value="news">新闻</Select.Option>
                  <Select.Option value="event">活动</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            {/* <RichTextEditor value={form.getFieldValue('description')}></RichTextEditor> */}
            {/* <Input.TextArea placeholder="请输入新闻描述" rows={4} /> */}
          </Form.Item>

          <Row gutter={20}>
            <Col span={12}>
              <Form.Item name="top" label="是否顶置" initialValue={false}>
                <Radio.Group>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="imageUrl" label="封面图片">
                <ImageUploader
                  maxCount={5}
                  fileList={imageList}
                  onImageSuccess={handleImageChange}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="videoUrl" label="视频链接">
            <Input placeholder="请输入视频链接（选填）" />
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setVisible(false)}>取消</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsManagement;