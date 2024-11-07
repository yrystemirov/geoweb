import { create } from 'zustand';
import { UserDto } from '../api/types/user';
import { persist, PersistOptions } from 'zustand/middleware';

type UserStore = {
  user: UserDto | null;
  setUser: (user: UserDto | null) => void;
};

type UserPersist = (config: (set: any) => UserStore, options: PersistOptions<UserStore>) => (set: any) => UserStore;

export const useUserStore = create<UserStore>(
  (persist as unknown as UserPersist)(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'user-store',
    },
  ),
);