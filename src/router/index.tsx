import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthPage from '@/pages/auth';
import DashboardPage from '@/pages/dashboard';
import ProductAddPage from '@/pages/products';
// import SettingsPage from '@/pages/settings';
import NotFoundPage from '@/pages/404';
import BannerList from '@/pages/banner';
import BrandCategoryManager from '@/pages/brandCategoryManager';
import CollaborationList from '@/pages/collaboration';
import NewsList from '@/pages/news';

export const Router: React.FC = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />
    },
    {
      path: '/login',
      element: <AuthPage />
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: 'dashboard',
          element: <DashboardPage />
        },
        {
          path: 'products',
          element: <ProductAddPage />
        },
        {
          path: '/banner',
          element: <BannerList />,
          // meta: {
          //   title: 'Banner管理'
          // }
        },
        {
          path: '/brandCategoryManager',
          element: <BrandCategoryManager />,
          // meta: {
          //   title: 'Banner管理'
          // }
        },
        {
          path: '/news',
          element: <NewsList />
        },
        {
          path: '/collaboration',
          element: <CollaborationList />
        },
        {
          path: 'settings',
          // element: <SettingsPage />
          element: <></>
        }
      ]
    },
    {
      path: '*',
      element: <NotFoundPage />
    }
  ]);

  return routes;
};