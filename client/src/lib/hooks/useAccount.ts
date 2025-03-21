import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoginSchema } from '../validations/login.schema';
import activityApi from '../api/activity.api';
import { User } from '../interfaces/user';
import { useLocation, useNavigate } from 'react-router-dom';
import { RegisterSchema } from '../validations/register.schema';
import toast from 'react-hot-toast';

export const useAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const loginUser = useMutation({
    mutationFn: async (credentials: LoginSchema) => {
      await activityApi.post('/login?useCookies=true', credentials);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
  const registerUser = useMutation({
    mutationFn: async (credentials: RegisterSchema) => {
      await activityApi.post('/account/register', credentials);
    },
    onSuccess: () => {
      toast.success('User created! Please login.');
      navigate('/login');
    },
  });
  const logoutUser = useMutation({
    mutationFn: async () => {
      await activityApi.post('/account/logout');
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user'] });
      queryClient.removeQueries({ queryKey: ['activities'] });
      navigate('/');
    },
  });
  const { data: currentUser, isLoading: isLoadingUserInfo } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await activityApi.get<User>('/account/user-info');
      return data;
    },
    enabled:
      !queryClient.getQueryData(['user']) &&
      location.pathname !== '/login' &&
      location.pathname !== '/register',
  });
  return {
    loginUser,
    currentUser,
    logoutUser,
    isLoadingUserInfo,
    registerUser,
  };
};
