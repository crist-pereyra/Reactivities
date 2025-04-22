import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Activity, Profile } from '../interfaces/activity';
import activityApi from '../api/activity.api';
import { Photo } from '../interfaces/photo';
import { useMemo, useState } from 'react';
import { User } from '../interfaces/user';
import toast from 'react-hot-toast';
import { EditProfileSchema } from '../validations/edit-profile.schema';

export const useProfile = (id?: string, predicate?: string) => {
  const [filter, setFilter] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isLoadingProfile } = useQuery<Profile>({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data } = await activityApi.get<Profile>(`/profiles/${id}`);
      return data;
    },
    enabled: !!id && !predicate,
  });

  const { data: photos, isLoading: isLoadingPhotos } = useQuery<Photo[]>({
    queryKey: ['photos', id],
    queryFn: async () => {
      const { data } = await activityApi.get<Photo[]>(`/profiles/${id}/photos`);
      return data;
    },
    enabled: !!id && !predicate,
  });

  const { data: followings, isLoading: isLoadingFollowings } = useQuery<
    Profile[]
  >({
    queryKey: ['followings', id, predicate],
    queryFn: async () => {
      const { data } = await activityApi.get<Profile[]>(
        `/profiles/${id}/follow-list?predicate=${predicate}`
      );
      return data;
    },
    enabled: !!id && !!predicate,
  });

  const uploadPhoto = useMutation({
    mutationFn: async (file: Blob) => {
      const formData = new FormData();
      formData.append('File', file);
      const { data } = await activityApi.post<Photo>(
        `/profiles/add-photo`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    },
    onSuccess: async (photo: Photo) => {
      await queryClient.invalidateQueries({ queryKey: ['photos', id] });
      queryClient.setQueryData(['user'], (data: User) => {
        if (!data) return data;
        return {
          ...data,
          imageUrl: data.imageUrl ?? photo.url,
        };
      });
      queryClient.setQueryData(['profile', id], (data: Profile) => {
        if (!data) return data;
        return {
          ...data,
          imageUrl: data.imageUrl ?? photo.url,
        };
      });
    },
  });

  const setMainPhoto = useMutation({
    mutationFn: async (photo: Photo) => {
      const { data } = await activityApi.put(
        `/profiles/${photo.id}/set-main-photo`
      );
      return data;
    },
    onSuccess: async (_, photo) => {
      toast.success('Photo set as main!');
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      await queryClient.invalidateQueries({ queryKey: ['profile', id] });

      queryClient.setQueryData(['user'], (data: User | undefined) => {
        if (!data) return data;
        return { ...data, imageUrl: photo.url };
      });

      queryClient.setQueryData(['profile', id], (data: Profile | undefined) => {
        if (!data) return data;
        return { ...data, imageUrl: photo.url };
      });
    },
  });

  const deletePhoto = useMutation({
    mutationFn: async (photoId: string) => {
      await activityApi.delete(`/profiles/${photoId}/photos`);
    },
    onSuccess: async (_, photoId) => {
      await queryClient.setQueryData(['photos', id], (data: Photo[]) => {
        return data?.filter((p) => p.id !== photoId);
      });
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (profile: EditProfileSchema) => {
      await activityApi.put(`/profiles`, profile);
    },
    onSuccess: (_, profile) => {
      queryClient.setQueryData(['profile', id], (data: Profile) => {
        if (!data) return data;
        return {
          ...data,
          displayName: profile.displayName,
          bio: profile.bio,
        };
      });
      queryClient.setQueryData(['user'], (userData: User) => {
        if (!userData) return userData;
        return {
          ...userData,
          displayName: profile.displayName,
        };
      });
    },
  });

  const updateFollowing = useMutation({
    mutationFn: async () => await activityApi.post(`/profiles/${id}/follow`),
    onSuccess: () => {
      queryClient.setQueryData(['profile', id], (profile: Profile) => {
        queryClient.invalidateQueries({
          queryKey: ['followings', id, 'followers'],
        });
        if (!profile || profile.followersCount === undefined) return profile;
        return {
          ...profile,
          following: !profile.following,
          followersCount: profile.following
            ? profile.followersCount - 1
            : profile.followersCount + 1,
        };
      });
    },
  });

  const { data: userActivities, isLoading: isLoadingUserActivities } = useQuery(
    {
      queryKey: ['user-activities', filter],
      queryFn: async () => {
        const response = await activityApi.get<Activity[]>(
          `/profiles/${id}/activities`,
          {
            params: {
              filter,
            },
          }
        );
        return response.data;
      },
      enabled: !!id && !!filter,
    }
  );

  const isCurrentUser = useMemo(() => {
    return id === queryClient.getQueryData<User>(['user'])?.id;
  }, [id, queryClient]);

  return {
    profile,
    isLoadingProfile,
    photos,
    isLoadingPhotos,
    isCurrentUser,
    uploadPhoto,
    setMainPhoto,
    deletePhoto,
    updateProfile,
    updateFollowing,
    followings,
    isLoadingFollowings,
    userActivities,
    isLoadingUserActivities,
    filter,
    setFilter,
  };
};
