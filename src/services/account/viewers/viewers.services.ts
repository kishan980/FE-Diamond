import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import {
  AddViewersParams,
  UpdateViewersParams,
  ViewersAddResponse,
  ViewersByIdResponse,
  ViewersListResponse,
  ViewersStatusByIdResponse,
  ViewersUpdateResponse,
} from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient, axiosExcel } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account/viewer`;

export class ViewersServices {
  private static showError(data: ViewersListResponse | ViewersStatusByIdResponse | ViewersByIdResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static getList = async (searchParams?: string): Promise<ViewersListResponse | string> => {
    try {
      const url = searchParams ? `${API_BASE_URL}?${searchParams}` : `${API_BASE_URL}`;
      const res = await axiosClient.get<ViewersListResponse>(url);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getviewer:', error);
      return ErrorMessage;
    }
  };

  static updateStatus = async (id: number): Promise<ViewersStatusByIdResponse | string> => {
    try {
      const res = await axiosClient.put<ViewersStatusByIdResponse>(`${API_BASE_URL}/updateStatus/${id}`, {});
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in updateStatus:', error);
      return ErrorMessage;
    }
  };

  static getById = async (id: number): Promise<ViewersByIdResponse | string> => {
    try {
      const res = await axiosClient.get<ViewersByIdResponse>(`${API_BASE_URL}/getById/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getById:', error);
      return ErrorMessage;
    }
  };

  static add = async (params: AddViewersParams): Promise<ViewersAddResponse | string> => {
    try {
      const res = await axiosClient.post<ViewersAddResponse>(`${API_BASE_URL}/add`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in add:', error);
      return ErrorMessage;
    }
  };

  static update = async (params: UpdateViewersParams): Promise<ViewersUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<ViewersUpdateResponse>(`${API_BASE_URL}/update`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in update:', error);
      return ErrorMessage;
    }
  };

  static exportExcel = async (): Promise<AxiosResponse<Blob> | null> => {
    try {
      const res = await axiosExcel().get(`${API_BASE_URL}/exportExcel`, {
        responseType: 'blob',
      });
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in exportExcel:', error);
      return null;
    }
  };
}
