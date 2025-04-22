import activityApi from '@/lib/api/activity.api';
import { Activity } from '@/lib/interfaces/activity';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useAccount } from './useAccount';
import { PagedList } from '../interfaces/paged-list';
import { useActivityStore } from '../stores/activity.store';

export const useActivities = (id?: string) => {
  const { filter, startDate } = useActivityStore();
  const queryClient = useQueryClient();
  const { currentUser } = useAccount();
  const location = useLocation();
  const {
    data: activitiesGroup,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<PagedList<Activity, string>>({
    queryKey: ['activities', filter, startDate],
    queryFn: async ({ pageParam = null }) => {
      const { data } = await activityApi.get<PagedList<Activity, string>>(
        '/activities',
        {
          params: { cursor: pageParam, pageSize: 3, filter, startDate },
        }
      );
      return data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !id && location.pathname === '/activities' && !!currentUser,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    // select: (data) => {
    //   return data.map((activity) => ({
    //     ...activity,
    //     isHost: currentUser?.id === activity.hostId,
    //     isGoing: activity.attendees.some((a) => a.id === currentUser?.id),
    //     hostImageUrl: activity.attendees.find((a) => a.id === activity.hostId)
    //       ?.imageUrl,
    //   }));
    // },
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        items: page.items.map((activity) => ({
          ...activity,
          isHost: currentUser?.id === activity.hostId,
          isGoing: activity.attendees.some((a) => a.id === currentUser?.id),
          hostImageUrl: activity.attendees.find((a) => a.id === activity.hostId)
            ?.imageUrl,
        })),
      })),
    }),
  });
  const { data: activity, isLoading: isActivityLoading } = useQuery({
    queryKey: ['activity', id],
    queryFn: async () => {
      const { data } = await activityApi.get<Activity>(`/activities/${id}`);
      return data;
    },
    enabled: !!id && !!currentUser,
    select: (data) => ({
      ...data,
      isHost: currentUser?.id === data.hostId,
      isGoing: data.attendees.some((a) => a.id === currentUser?.id),
      hostImageUrl: data.attendees.find((a) => a.id === data.hostId)?.imageUrl,
    }),
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
    // onError: () => toast.error('Error updating activity!'),
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
    // onError: () => toast.error('Error creating activity!'),
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
    // onError: () => toast.error('Error deleting activity!'),
  });

  const updateAttendance = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await activityApi.post(`/activities/${id}/attend`);
      return data;
    },
    onMutate: async (activityId: string) => {
      await queryClient.cancelQueries({ queryKey: ['activity', activityId] });
      const previousActivity = queryClient.getQueryData<Activity>([
        'activity',
        activityId,
      ]);

      queryClient.setQueryData<Activity>(
        ['activity', activityId],
        (oldActivity) => {
          if (!oldActivity || !currentUser) return oldActivity;

          const isHost = oldActivity.hostId === currentUser.id;
          const isAttending = oldActivity.attendees.some(
            (a) => a.id === currentUser.id
          );

          return {
            ...oldActivity,
            isCancelled: isHost
              ? !oldActivity.isCancelled
              : oldActivity.isCancelled,
            attendees: isAttending
              ? isHost
                ? oldActivity.attendees
                : oldActivity.attendees.filter((a) => a.id !== currentUser.id)
              : [
                  ...oldActivity.attendees,
                  {
                    id: currentUser.id,
                    displayName: currentUser.displayName,
                    imageUrl: currentUser?.imageUrl,
                  },
                ],
          };
        }
      );

      return { previousActivity };
    },
    onError: (error, activityId, context) => {
      console.log(error);
      if (context?.previousActivity) {
        queryClient.setQueryData(
          ['activity', activityId],
          context.previousActivity
        );
      }
    },
    // onSuccess: async () => {
    //   await queryClient.invalidateQueries({ queryKey: ['activity', id] });
    // },
  });
  return {
    activitiesGroup,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    updateActivity,
    createActivity,
    deleteActivity,
    activity,
    isActivityLoading,
    updateAttendance,
  };
};
