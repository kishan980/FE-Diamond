import axios, { AxiosInstance } from 'axios';
import { getUserTokenClient, getUserTokenServer } from './getSessionData';

export const createAxiosInstance = (context: 'client' | 'server' = 'client'): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  instance.interceptors.request.use(
    async (config) => {
      const token = context === 'client' ? await getUserTokenClient() : await getUserTokenServer();
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        // eslint-disable-next-line no-console
        console.warn('Unauthorized - Token might be expired');
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const createCustomAxios = (context: 'client' | 'server', contentType: string) => {
  const instance = createAxiosInstance(context);
  instance.defaults.headers['Content-Type'] = contentType;
  return instance;
};

export const axiosClient = createAxiosInstance('client');
export const axiosExcel = () => createCustomAxios('client', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
export const axiosFormData = () => createCustomAxios('client', 'multipart/form-data');
