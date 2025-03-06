import activityApi from '@/lib/api/activity.api';
import { Activity } from '@/lib/interfaces/activity';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useActivityStore } from '../stores/activity.store';

export const useActivities = () => {
  const setActivities = useActivityStore((state) => state.setActivities);
  const queryClient = useQueryClient();
  const { data: activities, isPending } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data } = await activityApi.get<Activity[]>('/activities');
      setActivities(data);
      return data;
    },
  });

  const updateActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      const { data } = await activityApi.put<Activity>('/activities', activity);
      return data;
    },
    onSuccess: async () => {
      toast.success('Activity updated!');
      await queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
    onError: () => toast.error('Error updating activity!'),
  });

  const createActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      const { data } = await activityApi.post<Activity>(
        '/activities',
        activity
      );
      return data;
    },
    onSuccess: async () => {
      toast.success('Activity created!');
      await queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
    onError: () => toast.error('Error creating activity!'),
  });

  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await activityApi.delete(`/activities/${id}`);
      return data;
    },
    onSuccess: async () => {
      toast.success('Activity deleted!');
      await queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
    onError: () => toast.error('Error deleting activity!'),
  });
  return {
    activities,
    isPending,
    updateActivity,
    createActivity,
    deleteActivity,
  };
};
