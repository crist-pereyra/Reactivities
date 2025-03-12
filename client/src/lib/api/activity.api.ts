import axios from 'axios';
import { useUiStore } from '../stores/ui.store';
import toast from 'react-hot-toast';
import { router } from '@/app/router/router';

const activityApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

activityApi.interceptors.request.use((config) => {
  useUiStore.getState().loading();
  return config;
});
activityApi.interceptors.response.use(
  async (res) => {
    useUiStore.getState().idle();
    return res;
  },
  async (err) => {
    useUiStore.getState().idle();
    console.log(`axios error: ${err}`);

    const { status, data } = err.response;
    switch (status) {
      case 400:
        if (data.errors) {
          const modalStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          // throw modalStateErrors.flat();
          toast.error(modalStateErrors.flat().join(', '));
        } else {
          toast.error(data || 'Bad request!');
        }
        break;
      case 401:
        toast.error('Unauthorized!');
        break;
      case 404:
        // toast.error('Not found!');
        router.navigate('/not-found');
        break;
      case 500:
        // toast.error('Internal server error!');
        router.navigate('/server-error', {
          state: { error: data },
        });
        break;
      default:
        break;
    }
    //* rethrow the error for react query to handle
    return Promise.reject(err);
  }
);

export default activityApi;
