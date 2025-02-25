import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import type { IBanner } from '@/types/banner';
import ImageUploader from '@/components/ImageUploader';
import { addBanner, updateBanner } from '@/api/banner';
import { messageApi } from '@/lib/utils';

const { Option } = Select;
const { TextArea } = Input;

interface BannerFormProps {
  initialValues?: IBanner | null;
  onSave: (values: IBanner) => void;
  onCancel: () => void;
  loading?: boolean;
}

const BannerForm = forwardRef<{ resetForm: () => void }, BannerFormProps>(({
  initialValues,
  onSave,
  onCancel,
  loading: externalLoading
}, ref) => {
  const [form] = Form.useForm();
  const [mediaData, setMediaData] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setMediaData(initialValues.media);
    }
  }, [initialValues, form]);

  const resetForm = () => {
    form.resetFields();
    setMediaData('');
  };

  useImperativeHandle(ref, () => ({
    resetForm
  }));

  const onChange = (data: string[]) => {
    console.log(mediaData, 'data: ', data);
    setMediaData(data[0]);
    form.setFieldValue('media', data[0]);
  }

  const handleSave = async (values: IBanner) => {
    try {
      setLoading(true);
      if (initialValues?.id) {
        await updateBanner(initialValues.id, values);
        messageApi.success('Banner 更新成功');
      } else {
        await addBanner(values);
        messageApi.success('Banner 创建成功');
      }
      onSave(values);
    } catch (error) {
      console.error('保存 Banner 时出错:', error);
      messageApi.error('保存 Banner 失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues || {
        type: 'image',
        status: 'active',
        order: 0,
      }}
      onFinish={handleSave}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="subtitle"
            label="副标题"
          >
            <Input placeholder="请输入副标题" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select>
              <Option value="image">图片</Option>
              <Option value="video">视频</Option>
            </Select>
          </Form.Item>
        </Col>
        {/* <Col span={12}>
          <Form.Item
            name="order"
            label="排序"
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </Col> */}

        <Col span={12}>
          <Form.Item
            name="src"
            label="图片/视频链接"
          >
            <Input placeholder="请输入按钮文字" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="buttonLink"
            label="点击跳转链接"
          >
            <Input placeholder="请输入按钮链接" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={4} placeholder="请输入描述" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="media"
            label={<p>媒体文件<span className='text-red-500'>(此处和上面的'图片/视频链接'只能填一个)</span></p>}
          >
            <ImageUploader maxCount={1} fileList={[mediaData]} onImageSuccess={onChange} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item className="mb-0 flex justify-end gap-2">
        <Button onClick={onCancel}>
          取消
        </Button>
        <Button type="primary" htmlType="submit" loading={loading || externalLoading}>
          保存
        </Button>
      </Form.Item>
    </Form>
  );
});

export default BannerForm;