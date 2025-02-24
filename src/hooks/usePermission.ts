import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useStore from '@/store';

export const usePermission = () => {
  const location = useLocation();
  const { userInfo } = useStore();

  const checkPermission = useCallback((permission: string) => {
    if (!userInfo) return false;
    return userInfo.permissions?.includes(permission);
  }, [userInfo]);

  const checkPagePermission = useCallback(() => {
    // 实现页面权限检查逻辑
    return true;
  }, [location, userInfo]);

  return {
    checkPermission,
    checkPagePermission
  };
};
