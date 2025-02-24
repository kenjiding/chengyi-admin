// src/api/category.ts
import { request } from "./request";
import { Brand, MainCategory, SubCategory } from "@/types/brand";

// 品牌相关接口
export const getBrands = () => request.get<Brand[]>('/brands');
export const addBrand = (data: { name: string }) => 
  request.post<Brand>('/brands', data);
export const updateBrand = (id: number, data: { name: string }) => 
  request.put<Brand>(`/brands?id=${id}`, data);
export const deleteBrand = (id: number) => 
  request.delete(`/brands?id=${id}`);

// 主类别相关接口
export const getMainCategories = (brandId?: number) => 
  request.get<MainCategory[]>('/main-categories', { params: { brandId } });
export const addMainCategory = (data: { name: string; brandId: number }) => 
  request.post<MainCategory>('/main-categories', data);
export const updateMainCategory = (id: number, data: { name: string; brandId: number }) => 
  request.put<MainCategory>(`/main-categories?id=${id}`, data);
export const deleteMainCategory = (id: number) => 
  request.delete(`/main-categories?id=${id}`);

// 子类别相关接口
export const getSubCategories = (mainCategoryId?: number) => 
  request.get<SubCategory[]>('/sub-categories', { params: { mainCategoryId } });
export const addSubCategory = (data: { name: string; mainCategoryId: number }) => 
  request.post<SubCategory>('/sub-categories', data);
export const updateSubCategory = (id: number, data: { name: string; mainCategoryId: number }) => 
  request.put<SubCategory>(`/sub-categories?id=${id}`, data);
export const deleteSubCategory = (id: number) => 
  request.delete(`/sub-categories?id=${id}`);

export interface CategoryTreeNode {
  value: number;
  label: string;
  children?: CategoryTreeNode[];
}

export const getCategoryTree = () => 
  request.get<CategoryTreeNode[]>('/categories-tree');