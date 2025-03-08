import axios from 'axios';
import { useUiStore } from '../stores/ui.store';

const activityApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

activityApi.interceptors.request.use((config) => {
  useUiStore.getState().loading();
  return config;
});
activityApi.interceptors.response.use(async (res) => {
  try {
    return res;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  } finally {
    useUiStore.getState().idle();
  }
});

export default activityApi;
