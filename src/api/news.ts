// api/news.ts
import {request} from './request';
import { News } from '@/types/news';

export const getNews = (params?: {
  page?: number;
  pageSize?: number;
  title?: string;
  type?: 'news' | 'event';
}) => request.get<{
  items: News[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }
}>('/news', params);

export const createNews = (data: Omit<News, 'id'>) => 
  request.post<News>('/news', data);

export const updateNews = (id: number, data: Partial<News>) => 
  request.put<News>(`/news/${id}`, data);

export const deleteNews = (id: number) => 
  request.delete(`/news/${id}`);