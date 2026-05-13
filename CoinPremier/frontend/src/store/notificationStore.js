import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  naoLidas: 0,
  setNaoLidas: (naoLidas) => set({ naoLidas: Number(naoLidas) || 0 }),
}));

export default useNotificationStore;
