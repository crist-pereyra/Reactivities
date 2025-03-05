import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  handleSubmitForm: (activity: Activity) => void;
  handleDeleteActivity: (id: string) => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
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
      handleSubmitForm: (activity: Activity) => {
        if (activity.id) {
          const updatedActivities = get().activities.map((a) => {
            if (a.id === activity.id) return activity;
            return a;
          });
          get().setActivities(updatedActivities);
        } else {
          const newActivity = {
            ...activity,
            id: get().activities.length.toString(),
          };
          get().setActivities([...get().activities, newActivity]);
          get().handleSelectActivity(newActivity.id);
        }
        get().handleCloseForm();
      },
      handleDeleteActivity: (id: string) => {
        const updatedActivities = get().activities.filter((a) => a.id !== id);
        get().setActivities(updatedActivities);
        // get().handleCancelSelectActivity();
      },
    }),
    { name: 'activity-store' }
  )
);
