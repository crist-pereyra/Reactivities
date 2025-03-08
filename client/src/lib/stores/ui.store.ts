import { create } from 'zustand';
interface UiState {
  isLoading: boolean;
  idle: () => void;
  loading: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isLoading: false,
  idle: () => set({ isLoading: false }),
  loading: () => set({ isLoading: true }),
}));
