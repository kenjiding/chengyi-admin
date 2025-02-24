import { request } from "./request";

export interface ProductFormData {
  name: string;
  subCategoryId: number | null;
  mainCategoryId: number | null;
  brandId: number;
  price: number;
  stock: number;
  description?: string;
  images: string[];
}

interface ProductResponse extends ProductFormData {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// 产品相关接口
export const getProduct = (data?: Partial<{
  id: number;
  name: string;
  modelNumber: string;
  brandId: number;
  subCategoryId: number;
  page?: number;
  pageSize?: number,
}>) => request.get<any>('/products', data);

export const addProduct = (data: ProductFormData) => 
  request.post<ProductResponse>('/products', data);

export const updateProduct = (id: number, data: Partial<ProductFormData>) => 
  request.put<ProductResponse>(`/products?id=${id}`, data);

export const deleteProduct = (id: number) => 
  request.delete<void>(`/products?id=${id}`);
