import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
import { Activity } from '../interfaces/activity';

interface ActivityState {
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  selectedActivity: Activity | undefined;
  handleSelectActivity: (id: string) => void;
  handleCancelSelectActivity: () => void;
  isEditMode: boolean;
  handleCloseForm: () => void;
  handleOpenForm: (id?: string) => void;
}

export const useActivityStore = create<ActivityState>()(
  // persist(
  (set, get) => ({
    activities: [],
    setActivities: (activities: Activity[]) => set({ activities }),
    selectedActivity: undefined,
    handleSelectActivity: (id: string) =>
      set({ selectedActivity: get().activities.find((a) => a.id === id) }),
    handleCancelSelectActivity: () => set({ selectedActivity: undefined }),
    isEditMode: false,
    handleCloseForm: () => set({ isEditMode: false }),
    handleOpenForm: (id?: string) => {
      if (id) get().handleSelectActivity(id);
      else get().handleCancelSelectActivity();

      set({ isEditMode: true });
    },
  })
  //   { name: 'activity-store' }
  // )
);
