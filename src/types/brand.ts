export interface Brand {
  id?: number;
  name: string;
  image?: string;
}

export interface MainCategory {
  id?: number;
  name: string;
  brandId: number;
  brand?: Brand;
}

export interface SubCategory {
  id?: number;
  name: string;
  mainCategoryId: number;
  mainCategory?: MainCategory;
}