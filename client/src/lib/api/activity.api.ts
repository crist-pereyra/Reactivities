import axios from 'axios';

const activityApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

activityApi.interceptors.response.use(async (res) => {
  try {
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
});

export default activityApi;
