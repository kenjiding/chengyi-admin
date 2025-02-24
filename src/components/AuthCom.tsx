import React, { ReactNode, memo } from 'react';
import useStore from '@/store';

type AuthComProps = {
  children: ReactNode
};

const AuthCom: React.FC<AuthComProps> = memo(({ children }) => {
  const userInfo = useStore(state => state.userInfo);
  const roles = userInfo?.roles?.split(',');

  return roles?.includes('admin') ? children : null;
});

export default AuthCom;