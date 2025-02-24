import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { IUserInfo } from '@/types/user';

type State = {
  userInfo: IUserInfo | null;
  token: string | null;
}

type Actions = {
  setUserInfo: (info: State) => void;
  logout: () => void;
}

export const useStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        userInfo: null,
        token: null,
        setUserInfo: (info) => set({ userInfo: info.userInfo, token: info.token }),
        logout: () => set({ userInfo: null, token: null })
      }),
      {
        name: 'admin-store'
      }
    )
  )
);

export default useStore;