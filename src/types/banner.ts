export interface IBanner {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  type: 'image' | 'video';
  media: string;
  order?: number;
  status: 'active' | 'inactive';
}