import { request } from "./request";
import { IBanner } from '@/types/banner';

export const getBanners = () => 
  request.get<IBanner[]>('/banners');

export const getBanner = (id: number) => 
  request.get<IBanner>(`/banners/${id}`);

export const addBanner = (data: IBanner) => 
  request.post<IBanner>('/banners', data);

export const updateBanner = (id: number, data: Partial<IBanner>) => 
  request.put<IBanner>(`/banners/${id}`, data);

export const deleteBanner = (id: number) => 
  request.delete<void>(`/banners/${id}`);