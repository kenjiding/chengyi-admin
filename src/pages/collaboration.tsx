import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Modal, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { ICollaboration } from '@/types/collaboration';
import CollaborationForm from '@/components/CollaborationForm';
import { getCollaborations, deleteCollaboration, addCollaboration, updateCollaboration } from '@/api/collaboration';
import { getUrl } from '@/lib/utils';

const CollaborationList: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [editingCollaboration, setEditingCollaboration] = useState<ICollaboration | null>(null);
  const [loading, setLoading] = useState(false);
  const [collaborations, setCollaborations] = useState<ICollaboration[]>([]);
  const formRef = useRef<{ resetForm: () => void } | null>(null);

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      setLoading(true);
      const data = await getCollaborations();
      setCollaborations(data);
    } catch (error) {
      message.error('获取合作伙伴列表失败');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<ICollaboration> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '图片',
      dataIndex: 'image',
      width: 120,
      render: (image: string) => (
        <img src={getUrl(image)} alt="合作伙伴logo" className="w-20 h-12 object-contain rounded" />
      ),
    },
    {
      title: '数量',
      dataIndex: 'count',
      width: 100,
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
            title="确定删除这个合作伙伴吗?"
            onConfirm={() => record.id && handleDelete(record.id)}
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

  const handleEdit = (collaboration: ICollaboration) => {
    setEditingCollaboration(collaboration);
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCollaboration(id);
      message.success('删除成功');
      fetchCollaborations();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleOpenModal = () => {
    setEditingCollaboration(null);
    setVisible(true);
    if (formRef.current) {
      formRef.current.resetForm();
    }
  };

  const handleSave = async (values: ICollaboration) => {
    console.log('values: ', values);
    try {
      setLoading(true);
      // 保存逻辑应该在 CollaborationForm 组件中实现
      if(values.id !== undefined && values.id !== null) {
        await updateCollaboration(values.id, values);
      } else {
        await addCollaboration(values);
      }
      message.success('操作成功');
      setVisible(false);
      setEditingCollaboration(null);
      fetchCollaborations();
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-medium">合作伙伴管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
        >
          添加合作伙伴
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={collaborations}
        rowKey="id"
        pagination={false}
        loading={loading}
      />

      <Modal
        title={editingCollaboration ? '编辑合作伙伴' : '添加合作伙伴'}
        open={visible}
        onCancel={() => {
          setVisible(false);
          setEditingCollaboration(null);
        }}
        footer={null}
        width={800}
      >
        <CollaborationForm
          ref={formRef}
          initialValues={editingCollaboration}
          onSave={handleSave}
          onCancel={() => setVisible(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default CollaborationList;