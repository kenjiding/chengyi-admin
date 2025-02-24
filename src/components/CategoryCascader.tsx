import React, { useState, useEffect } from 'react';
import { Cascader } from 'antd';
import { getCategoryTree, CategoryTreeNode } from '@/api/category';

interface CategoryCascaderProps {
  onChange?: (value: number[]) => void;
  data?: number[];
}

const CategoryCascader: React.FC<CategoryCascaderProps> = ({ 
  onChange, 
  data 
}) => {
  const [options, setOptions] = useState<CategoryTreeNode[]>([]);

  useEffect(() => {
    const fetchCategoryTree = async () => {
      try {
        const treeData = await getCategoryTree();
        setOptions(treeData);
      } catch (error) {
        console.error('获取分类树失败', error);
      }
    };

    fetchCategoryTree();
  }, []);

  const handleChange = (value: number[]) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Cascader
      options={options}
      onChange={handleChange}
      value={data}
      changeOnSelect
      placeholder="选择分类"
      style={{ width: '100%' }}
    />
  );
};

export default CategoryCascader;