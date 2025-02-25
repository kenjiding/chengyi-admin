import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Table,
  Popconfirm,
  Tabs,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import {
  getBrands,
  getMainCategories,
  getSubCategories,
  addBrand,
  addMainCategory,
  addSubCategory,
  updateBrand,
  updateMainCategory,
  updateSubCategory,
  deleteBrand,
  deleteMainCategory,
  deleteSubCategory
} from '@/api/category';
import { Brand, MainCategory, SubCategory } from '@/types/brand';
import ImageUploader from '@/components/ImageUploader';
import { getUrl } from '@/lib/utils';
import AuthCom from '@/components/AuthCom';
import { messageApi as message } from '@/lib/utils';

const CategoryManagement: React.FC = () => {
  const [brandForm] = Form.useForm();
  const [mainCategoryForm] = Form.useForm();
  const [subCategoryForm] = Form.useForm();
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingMainCategory, setEditingMainCategory] = useState<MainCategory | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [brandImg, setBrandImg] = useState<string[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [tableLoadingObj, setTableLoadingObj] = useState({
    brandTableLoading: false,
    mainCTableLoading: false,
    subCTableLoading: false,
  });

  const [loadingObj, setLoadingObj] = useState({
    brandLoading: false,
    mainCLoading: false,
    subCLoading: false,
  });
  const fetchData = async () => {
    try {
      setTableLoadingObj({
        brandTableLoading: true,
        mainCTableLoading: true,
        subCTableLoading: true,
      });
      const [brandsData, mainCategoriesData, subCategoriesData] = await Promise.all([
        getBrands(),
        getMainCategories(),
        getSubCategories()
      ]);

      setBrands(brandsData);
      setMainCategories(mainCategoriesData);
      setSubCategories(subCategoriesData);
    } catch (error) {
      message.error('数据加载失败');
      console.error(error);
    } finally {
      setTableLoadingObj({
        brandTableLoading: false,
        mainCTableLoading: false,
        subCTableLoading: false,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 品牌操作
  const handleAddBrand = async (values: Pick<Brand, 'name'>) => {
    try {
      setLoadingObj({
        ...loadingObj,
        brandLoading: true,
      });
      await addBrand(values);
      message.success('品牌添加成功');
      brandForm.resetFields();
      setBrandImg([]);
      fetchData();
    } catch (error) {
      message.error('添加品牌失败');
      console.error(error);
    } finally {
      setLoadingObj({
        ...loadingObj,
        brandLoading: false,
      });
    }
  };

  const handleEditBrand = async (values: Pick<Brand, 'name'>) => {
    if (!editingBrand?.id) return;
    try {
      setLoadingObj({
        ...loadingObj,
        brandLoading: true,
      });
      await updateBrand(editingBrand.id, values);
      message.success('品牌编辑成功');
      setEditingBrand(null);
      setBrandImg([]);
      fetchData();
    } catch (error) {
      message.error('编辑品牌失败');
      console.error(error);
    } finally {
      setLoadingObj({
        ...loadingObj,
        brandLoading: false,
      });
    }
  };

  const handleDeleteBrand = async (id: number) => {
    try {
      await deleteBrand(id);
      message.success('品牌删除成功');
      fetchData();
    } catch (error) {
      message.error('删除品牌失败');
      console.error(error);
    }
  };

  // 主类别操作
  const handleAddMainCategory = async (values: Omit<MainCategory, 'id' | 'brand'>) => {
    try {
      setLoadingObj({
        ...loadingObj,
        mainCLoading: true,
      });
      await addMainCategory(values);
      message.success('主类别添加成功');
      mainCategoryForm.resetFields();
      fetchData();
    } catch (error) {
      message.error('添加主类别失败');
      console.error(error);
    } finally {
      setLoadingObj({
        ...loadingObj,
        mainCLoading: false,
      });
    }
  };

  const brandImgChange = (data: string[]) => {
    setBrandImg(data);
    brandForm.setFieldValue('image', data[0]);
  }

  const handleEditMainCategory = async (values: Omit<MainCategory, 'id' | 'brand'>) => {
    if (!editingMainCategory?.id) return;
    try {
      setLoadingObj({
        ...loadingObj,
        mainCLoading: true,
      });
      await updateMainCategory(editingMainCategory.id, values);
      message.success('主类别编辑成功');
      setEditingMainCategory(null);
      fetchData();
    } catch (error) {
      message.error('编辑主类别失败');
      console.error(error);
    } finally {
      setLoadingObj({
        ...loadingObj,
        mainCLoading: false,
      });
    }
  };

  const handleDeleteMainCategory = async (id: number) => {
    try {
      await deleteMainCategory(id);
      message.success('主类别删除成功');
      fetchData();
    } catch (error) {
      message.error('删除主类别失败');
      console.error(error);
    }
  };

  // 子类别操作
  const handleAddSubCategory = async (values: Omit<SubCategory, 'id' | 'mainCategory'>) => {
    try {
      setLoadingObj({
        ...loadingObj,
        subCLoading: true,
      });
      await addSubCategory(values);
      message.success('子类别添加成功');
      subCategoryForm.resetFields();
      fetchData();
    } catch (error) {
      message.error('添加子类别失败');
      console.error(error);
    } finally {
      setLoadingObj({
        ...loadingObj,
        subCLoading: false,
      });
    }
  };

  const handleEditSubCategory = async (values: Omit<SubCategory, 'id' | 'mainCategory'>) => {
    if (!editingSubCategory?.id) return;
    try {
      setLoadingObj({
        ...loadingObj,
        subCLoading: true,
      });
      await updateSubCategory(editingSubCategory.id, values);
      message.success('子类别编辑成功');
      setEditingSubCategory(null);
      fetchData();
    } catch (error) {
      message.error('编辑子类别失败');
      console.error(error);
    } finally {
      setLoadingObj({
        ...loadingObj,
        subCLoading: false,
      });
    }
  };

  const handleDeleteSubCategory = async (id: number) => {
    try {
      await deleteSubCategory(id);
      message.success('子类别删除成功');
      fetchData();
    } catch (error) {
      message.error('删除子类别失败');
      console.error(error);
    }
  };

  // 表格列定义
  const brandColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '品牌名称', dataIndex: 'name', key: 'name' },
    { 
      title: '品牌图片', 
      dataIndex: 'image', 
      key: 'image', 
      render: (src: string) => src ? <img className='w-20 h-20 object-cover' src={getUrl(src)} alt="品牌图片" /> : null 
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: Brand) => (
        <AuthCom>
          <div className="space-x-2">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingBrand(record);
                setBrandImg(record.image ? [record.image] : []);
                brandForm.setFieldsValue(record);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定删除这个品牌吗?"
              onConfirm={() => handleDeleteBrand(record.id!)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </div>
        </AuthCom>
      )
    }
  ];

  const mainCategoryColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: '品牌',
      dataIndex: ['brand', 'name'],
      key: 'brandName',
      render: (_: any, record: MainCategory) => record.brand?.name
    },
    { title: '主类别名称', dataIndex: 'name', key: 'name' },
    {
      title: '操作',
      key: 'actions',
      render: (record: MainCategory) => (
        <AuthCom>
          <div className="space-x-2">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingMainCategory(record);
                mainCategoryForm.setFieldsValue({
                  brandId: record.brandId,
                  name: record.name
                });
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定删除这个主类别吗?"
              onConfirm={() => handleDeleteMainCategory(record.id!)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </div>
        </AuthCom>
        
      )
    }
  ];

  const subCategoryColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: '主类别',
      dataIndex: ['mainCategory', 'name'],
      key: 'mainCategoryName',
      render: (_: any, record: SubCategory) => record.mainCategory?.name
    },
    { title: '子类别名称', dataIndex: 'name', key: 'name' },
    {
      title: '操作',
      key: 'actions',
      render: (record: SubCategory) => (
        <AuthCom>
          <div className="space-x-2">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingSubCategory(record);
                subCategoryForm.setFieldsValue({
                  mainCategoryId: record.mainCategoryId,
                  name: record.name
                });
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定删除这个子类别吗?"
              onConfirm={() => handleDeleteSubCategory(record.id!)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </div>
        </AuthCom>
      )
    }
  ];

  const tabItems = [
    {
      key: '1',
      label: '品牌管理',
      children: (
        <div className="bg-white p-6 rounded-lg shadow">
          <Form<Pick<Brand, 'name'>>
            form={brandForm}
            onFinish={editingBrand ? handleEditBrand : handleAddBrand}
            layout="vertical"
          >
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="品牌名称"
                  rules={[{ required: true, message: '请输入品牌名称' }]}
                >
                  <Input placeholder="请输入品牌名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <div className='text-right'>
                  <Form.Item>
                    <Button loading={loadingObj.brandLoading} type="primary" htmlType="submit" icon={<PlusOutlined />}>
                      {editingBrand ? '保存' : '添加'}
                    </Button>
                    {editingBrand && (
                      <Button
                        onClick={() => {
                          setEditingBrand(null);
                          brandForm.resetFields();
                          setBrandImg([]);
                        }}
                        className="ml-2"
                      >
                        取消
                      </Button>
                    )}
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Form.Item
              name="image"
              label="品牌图片"
              rules={[{ required: true, message: '请上传品牌图片' }]}
            >
              <ImageUploader maxCount={1} fileList={brandImg} onImageSuccess={brandImgChange} />
            </Form.Item>
          </Form>
          <div className="h-[calc(100vh-400px)] overflow-y-auto mt-4">
            <Table 
              columns={brandColumns} 
              dataSource={brands}
              loading={tableLoadingObj.brandTableLoading}
              rowKey="id"
              pagination={false}
              scroll={{ y: 'calc(100vh - 500px)' }}
            />
          </div>
        </div>
      )
    },
    {
      key: '2',
      label: '主类别管理',
      children: (
        <div className="bg-white p-6 rounded-lg shadow">
          <Form<Omit<MainCategory, 'id' | 'brand'>>
            form={mainCategoryForm}
            onFinish={editingMainCategory ? handleEditMainCategory : handleAddMainCategory}
            layout="vertical"
          >
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  name="brandId"
                  label="选择品牌"
                  rules={[{ required: true, message: '请选择品牌' }]}
                >
                  <Select placeholder="请选择品牌">
                    {brands.map(brand => (
                      <Select.Option key={brand.id} value={brand.id}>
                        {brand.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="主类别名称"
                  rules={[{ required: true, message: '请输入主类别名称' }]}
                >
                  <Input placeholder="请输入主类别名称" />
                </Form.Item>
              </Col>
            </Row>
            <div className='text-right'>
              <Form.Item>
                <Button loading={loadingObj.mainCLoading} type="primary" htmlType="submit" icon={<PlusOutlined />}>
                  {editingMainCategory ? '保存' : '添加'}
                </Button>
                {editingMainCategory && (
                  <Button
                    onClick={() => {
                      setEditingMainCategory(null);
                      mainCategoryForm.resetFields();
                    }}
                    className="ml-2"
                  >
                    取消
                  </Button>
                )}
              </Form.Item>
            </div>
          </Form>
          <div className="h-[calc(100vh-400px)] overflow-y-auto mt-4">
            <Table 
              columns={mainCategoryColumns} 
              dataSource={mainCategories}
              loading={tableLoadingObj.mainCTableLoading}
              rowKey="id"
              pagination={false}
              scroll={{ y: 'calc(100vh - 500px)' }}
            />
          </div>
        </div>
      )
    },
    {
      key: '3',
      label: '子类别管理',
      children: (
        <div className="bg-white p-6 rounded-lg shadow">
          <Form<Omit<SubCategory, 'id' | 'mainCategory'>>
            form={subCategoryForm}
            onFinish={editingSubCategory ? handleEditSubCategory : handleAddSubCategory}
            layout="vertical"
          >
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  name="mainCategoryId"
                  label="选择主类别"
                  rules={[{ required: true, message: '请选择主类别' }]}
                >
                  <Select placeholder="请选择主类别">
                    {mainCategories.map(category => (
                      <Select.Option key={category.id} value={category.id}>
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="子类别名称"
                  rules={[{ required: true, message: '请输入子类别名称' }]}
                >
                  <Input placeholder="请输入子类别名称" />
                </Form.Item>
              </Col>
            </Row>
            <div className='text-right'>
              <Form.Item>
                <Button loading={loadingObj.subCLoading} type="primary" htmlType="submit" icon={<PlusOutlined />}>
                  {editingSubCategory ? '保存' : '添加'}
                </Button>
                {editingSubCategory && (
                  <Button
                    onClick={() => {
                      setEditingSubCategory(null);
                      subCategoryForm.resetFields();
                    }}
                    className="ml-2"
                  >
                    取消
                  </Button>
                )}
              </Form.Item>
            </div>
          </Form>
          <div className="h-[calc(100vh-400px)] overflow-y-auto mt-4">
            <Table 
              columns={subCategoryColumns} 
              dataSource={subCategories}
              loading={tableLoadingObj.subCTableLoading}
              rowKey="id"
              pagination={false}
              scroll={{ y: 'calc(100vh - 500px)' }}
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default CategoryManagement;