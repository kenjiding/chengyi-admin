import { forwardRef, useImperativeHandle, useState } from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { ICollaboration } from '@/types/collaboration';
import ImageUploader from '@/components/ImageUploader';

interface CollaborationFormProps {
  initialValues?: ICollaboration | null;
  onSave: (values: ICollaboration) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface CollaborationFormRef {
  resetForm: () => void;
}

const CollaborationForm = forwardRef<CollaborationFormRef, CollaborationFormProps>(
  ({ initialValues, onSave, onCancel, loading }, ref) => {
    const [form] = Form.useForm();
    const [imgList, setImgList] = useState([]);

    useImperativeHandle(ref, () => ({
      resetForm: () => form.resetFields(),
    }));

    const onImageSuccess = (fileList: any) => {
      setImgList(fileList);
      form.setFieldValue('image', fileList[0]);
    }

    const onFinish = (values: ICollaboration) => {
      onSave(values);
    };

    return (
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues || {}}
        onFinish={onFinish}
      >
        <Form.Item
          name="id"
          label="ID"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: '请输入合作伙伴名称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="image"
          label="Logo"
          rules={[{ required: true, message: '请上传合作伙伴Logo' }]}
        >
          <ImageUploader fileList={imgList} maxCount={1} onImageSuccess={onImageSuccess} />
        </Form.Item>

        <Form.Item
          name="count"
          label="数量"
          rules={[{ required: true, message: '请输入数量' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: 8 }}>
            取消
          </Button>
        </Form.Item>
      </Form>
    );
  }
);

export default CollaborationForm;