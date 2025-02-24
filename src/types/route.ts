import { ReactNode } from 'react';

export interface RouteItem {
  path: string;
  element?: ReactNode;
  children?: RouteItem[];
  meta?: {
    title: string;
    icon?: ReactNode;
    requiresAuth?: boolean;
    permissions?: string[];
  };
}
