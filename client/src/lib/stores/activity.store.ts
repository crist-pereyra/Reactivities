import { create } from 'zustand';

interface ActivityState {
  filter: string;
  startDate: string;
  setFilter: (filter: string) => void;
  setStartDate: (date: Date) => void;
}

export const useActivityStore = create<ActivityState>()((set) => ({
  filter: 'all',
  startDate: new Date().toISOString(),
  setFilter: (filter: string) => set({ filter }),
  setStartDate: (date: Date) => set({ startDate: date.toISOString() }),
}));
