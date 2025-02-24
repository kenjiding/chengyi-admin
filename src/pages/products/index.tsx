import React, { useEffect, useRef, useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  message, 
  Modal, 
  Form, 
  InputNumber,
  Popconfirm,
  Row,
  Col,
  Pagination,
  Radio
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { getProduct, addProduct, updateProduct, deleteProduct } from '@/api/products';
import CategoryCascader from '@/components/CategoryCascader';
import ImageUploader from '@/components/ImageUploader';
import { getCategoryTree } from '@/api/category';
import AuthCom from '@/components/AuthCom';

const { TextArea } = Input;

function convertCategoryToFullName(categoryValue: any[], treeData: any) {
  const [brandId, mainCategoryId, subCategoryId] = categoryValue;
  let str = '';

  for (const brand of treeData) {
    if (brand.value === brandId) {
      str += brand.label;
    }

    for (const mainCategory of brand.children || []) {
      if (mainCategory.value === mainCategoryId) {
        str += `-${mainCategory.label}`;
      }

      for (const subCategory of mainCategory.children || []) {
        if (subCategory.value === subCategoryId) {
          str += `-${subCategory.label}`;
        }
      }
    }
  }

  return str;
}

interface ProductFormData {
  id?: number;
  name: string;
  special?: boolean;
  subCategoryId: number | null;
  mainCategoryId: number | null;
  categoryIds?: number[];
  brandId: number;
  price: number;
  stock: number;
  features: string[];
  description?: string;
  images: string[];
}

interface PaginationData {
  current: number;
  pageSize: number;
  total: number;
}

const initialValues: ProductFormData = {
  id: 0,
  name: '',
  special: false,
  subCategoryId: 0,
  mainCategoryId: 0,
  brandId: 0,
  price: 0,
  stock: 0,
  description: '',
  categoryIds: [],
  features: [],
  images: []
};

const ProductListPage: React.FC = () => {
  const [form] = Form.useForm<ProductFormData>();
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Table 的加载状态
  const [submitLoading, setSubmitLoading] = useState<boolean>(false); // 新增：Modal 提交的加载状态
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const treeData = useRef<any[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    (async () => {
      treeData.current = await getCategoryTree();
    })();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [pagination.current, pagination.pageSize, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { items, pagination: paginationData } = await getProduct({
        page: pagination.current,
        pageSize: pagination.pageSize,
        name: searchQuery
      });
      setProducts(items.map((product: ProductFormData) => ({
        ...product,
        subCategoryId: product.subCategoryId ? ('B-' + product.subCategoryId) : undefined,
        mainCategoryId: product.mainCategoryId ? ('B-' + product.mainCategoryId) : undefined,
        brandId: 'A-' + product.brandId,
      })));
      setPagination(prev => ({
        ...prev,
        total: paginationData.totalCount
      }));
    } catch (error) {
      message.error('获取商品列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    form.resetFields();
    setCategoryIds([]);
    setImages([]);
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleOpenEditModal = (record: ProductFormData) => {
    const categoryPath = [
      record.brandId, 
      record.mainCategoryId, 
      record.subCategoryId
    ].filter(Boolean) as number[];

    form.setFieldsValue({ ...record, categoryIds: categoryPath });
    setCategoryIds(categoryPath);
    setImages(record.images || []);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDelete = async (record: ProductFormData) => {
    try {
      if (record.id === undefined || record.id === null) {
        message.error('无效的商品ID');
        return;
      }
      
      await deleteProduct(record.id);
      message.success('商品删除成功');
      fetchProducts();
    } catch (error) {
      message.error('删除商品失败');
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true); // 开始提交时显示 loading
      await form.validateFields();

      if (categoryIds.length === 0) {
        message.error('请选择商品分类');
        return;
      }

      if (images.length === 0) {
        message.error('请添加图片');
        return;
      }

      const [brandId, mainCategoryId, subCategoryId] = categoryIds;
      const values = form.getFieldsValue();

      const productData = {
        ...values,
        subCategoryId: subCategoryId || null,
        mainCategoryId: mainCategoryId || null,
        brandId,
        images
      };

      console.log('productData: ', productData);
      if (isEditing && productData.id !== undefined) {
        await updateProduct(productData.id, productData);
        message.success('商品更新成功');
      } else {
        delete productData.id;
        await addProduct(productData);
        message.success('商品添加成功');
      }

      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error(isEditing ? '更新商品失败' : '添加商品失败');
      console.error(error);
    } finally {
      setSubmitLoading(false); // 提交结束后关闭 loading
    }
  };

  const handleImageChange = (imageUrls: string[]) => {
    setImages(imageUrls);
    form.setFieldValue('images', imageUrls);
  };

  const handleTableChange = (pagination: PaginationData) => {
    setPagination(pagination);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '特价商品',
      dataIndex: 'special',
      key: 'special',
      render: (val: boolean) => val ? '是' : '否'
    },
    {
      title: '类别',
      dataIndex: 'brandId',
      key: 'brandId',
      onCell: (record: any) => ({
        children: convertCategoryToFullName([record.brandId, record.mainCategoryId, record.subCategoryId], treeData.current)
      }),
      render: (value: string) => value
    },
    {
      title: '图片',
      dataIndex: 'images',
      key: 'images',
      width: 200,
      render: (images: string[]) => {
        return <ul className='list-none'>
          { <img src={images[0]} className='h-20 object-contain'></img> }
        </ul>
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (value: string) => value?.slice(0, 100)
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ProductFormData) => (
        <AuthCom>
          <Space>
            <Button 
              type="link" 
              icon={<EditOutlined />}
              onClick={() => handleOpenEditModal(record)}
            >
              编辑
            </Button>

            <Popconfirm
              title="确定删除这个商品吗?"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        </AuthCom>
      )
    }
  ];

  return (
    <div className="">
      <div className="flex justify-between mb-4">
        <Input.Search
          placeholder="搜索商品"
          className="w-72"
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenAddModal}
        >
          添加商品
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{
          y: 'calc(100vh - 300px)',
          x: 1200
        }}
        className="shadow-sm"
      />
      <div className='flex justify-center'>
        <Pagination
          className="mt-4 text-right"
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) => handleTableChange({ current: page, pageSize, total: pagination.total })}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条记录`}
        />
      </div>

      <Modal
        title={isEditing ? "编辑商品" : "添加商品"}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okButtonProps={{ loading: submitLoading }} // 添加 loading 效果到确定按钮
        width={800}
      >
        <Form
          form={form}
          initialValues={initialValues}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item name="id" hidden={true}>
            <Input />
          </Form.Item>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="商品名称"
                rules={[{ required: true, message: '请输入商品名称' }]}
              >
                <Input placeholder="请输入商品名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categoryIds"
                label="商品分类"
              >
                <CategoryCascader
                  data={categoryIds}
                  onChange={setCategoryIds}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                name="features"
                label="商品参数"
              >
                <Input.TextArea
                  className="w-full"
                  placeholder="请输入商品参数, 每个参数以逗号分隔"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="special"
                label={<p>特价商品<span className='text-red-600'>(选择'是', 此商品将会出现在特价商品展示区)</span></p>}
              >
                <Radio.Group>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                name="price"
                label={<p>价格<span className='text-red-600'>(当选中'特价商品', 需要填写此项)</span></p>}
              >
                <Input
                  className="w-full"
                  placeholder="请输入商品价格"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stock"
                label={<p>库存数量<span className='text-red-600'>(当选中'特价商品', 需要填写此项)</span></p>}
              >
                <InputNumber 
                  className="w-full"
                  min={0}
                  placeholder="请输入库存数量"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="商品描述"
          >
            <TextArea
              rows={4}
              placeholder="请输入商品描述"
            />
          </Form.Item>

          <Form.Item
            name="images"
            label={<p>商品图片<span className='text-red-600'>(可上传多张图片)</span></p>}
          >
            <ImageUploader 
              fileList={images} 
              onImageSuccess={handleImageChange} 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductListPage;