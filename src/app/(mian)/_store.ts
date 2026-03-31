import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IUser } from './_type';

interface StoreState {
  user: IUser.asObject | null;
  userHistory: IUser.asObject[];
  isHistoryDrawerOpen: boolean;
  coord: [number, number];
  country_code: string; // 可选属性，可能用于存储国家代码
  loadingAddress: boolean; // 是否正在加载地址信息
  hideMapTips: boolean; // 是否显示提示信息
  hideHistoryTip: boolean;
  setHideMapTips: (show: boolean) => void;
  setHideHistoryTip: (hide: boolean) => void;
  setCountryCode: (code: string) => void;
  setCoord: (coord: [number, number]) => void;
  setUser: (user: IUser.asObject) => void;
  addToHistory: (user: IUser.asObject) => void;
  clearHistory: () => void;
  setHistoryDrawerOpen: (open: boolean) => void;
  setLoadingAddress: (loading: boolean) => void;
}

const HISTORY_LIMIT = 20;

function getGeneratedAt(user: IUser.asObject) {
  return user.generatedAt ?? new Date().toISOString();
}

function sortHistoryByGeneratedAt(users: IUser.asObject[]) {
  return [...users].sort(
    (left, right) =>
      new Date(getGeneratedAt(right)).getTime() -
      new Date(getGeneratedAt(left)).getTime()
  );
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      coord: [0, 0],
      country_code: 'us', // 初始化为 undefined
      userHistory: [],
      loadingAddress: false,
      isHistoryDrawerOpen: false,
      hideMapTips: false,
      hideHistoryTip: false,
      setHideMapTips: (show: boolean) => set({ hideMapTips: show }),
      setHideHistoryTip: (hide: boolean) => set({ hideHistoryTip: hide }),
      setLoadingAddress: (loading: boolean) => set({ loadingAddress: loading }),
      setCountryCode: (code: string) => set({ country_code: code }),
      setCoord: (coord: [number, number]) => set({ coord }),
      setUser: (user: IUser.asObject) => {
        const normalizedUser = {
          ...user,
          generatedAt: getGeneratedAt(user),
        };

        set({ user: normalizedUser });
        // 添加到历史记录
        get().addToHistory(normalizedUser);
      },
      addToHistory: (user: IUser.asObject) => {
        const currentHistory = get().userHistory;
        const existingHistoryUser = currentHistory.find(
          (historyUser) => historyUser.email === user.email
        );
        const normalizedUser = {
          ...existingHistoryUser,
          ...user,
          generatedAt: existingHistoryUser?.generatedAt ?? getGeneratedAt(user),
        };
        const dedupedHistory = currentHistory.filter(
          (historyUser) => historyUser.email !== normalizedUser.email
        );
        const newHistory = sortHistoryByGeneratedAt([
          normalizedUser,
          ...dedupedHistory,
        ]).slice(0, HISTORY_LIMIT);

        set({ userHistory: newHistory });
      },
      clearHistory: () => set({ userHistory: [] }),
      setHistoryDrawerOpen: (open: boolean) =>
        set({ isHistoryDrawerOpen: open }),
    }),
    {
      name: 'user-storage', // 存储名称
      storage: createJSONStorage(() => localStorage), // 存储介质
    }
  )
);
