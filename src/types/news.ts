// @/types/index.ts

export interface News {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  type: 'news' | 'event';
  top: boolean;
  publishDate: string; // ISO 8601 date string
  createdAt: string;
  updatedAt: string;
}

// 用于创建新闻时的类型，排除了自动生成的字段
export type NewsInsert = Omit<News, 'id' | 'publishDate' | 'createdAt' | 'updatedAt'>;