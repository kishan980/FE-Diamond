import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import {
  AddAdministratorParams,
  AdministratorsAddResponse,
  AdministratorsByIdResponse,
  AdministratorsListResponse,
  AdministratorsUpdateResponse,
  CheckUserNameResponse,
  UpdateAdministratorParams,
} from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient, axiosExcel } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account/admin`;

export class AdministratorServices {
  private static showError(data: AdministratorsListResponse | AdministratorsAddResponse | AdministratorsByIdResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static getList = async (searchParams?: string): Promise<AdministratorsListResponse | string> => {
    try {
      const url = searchParams ? `${API_BASE_URL}?searchParams=${searchParams}` : `${API_BASE_URL}`;
      const res = await axiosClient.get<AdministratorsListResponse>(url);

      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getAdminList:', error);
      return ErrorMessage;
    }
  };

  static add = async (params: AddAdministratorParams): Promise<AdministratorsAddResponse | string> => {
    try {
      const res = await axiosClient.post<AdministratorsAddResponse>(`${API_BASE_URL}/add`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in add:', error);
      return ErrorMessage;
    }
  };

  static update = async (params: UpdateAdministratorParams): Promise<AdministratorsUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<AdministratorsUpdateResponse>(`${API_BASE_URL}/update`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in update:', error);
      return ErrorMessage;
    }
  };

  static getById = async (id: number): Promise<AdministratorsByIdResponse | string> => {
    try {
      const res = await axiosClient.get<AdministratorsByIdResponse>(`${API_BASE_URL}/getById/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getById:', error);
      return ErrorMessage;
    }
  };

  static checkUsername = async (username: string): Promise<CheckUserNameResponse | string> => {
    try {
      const res = await axiosClient.get<CheckUserNameResponse>(`${API_BASE_URL}/checkUsername?username=${username}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in checkUsername:', error);
      return ErrorMessage;
    }
  };

  static delete = async (id: number): Promise<AdministratorsListResponse | string> => {
    try {
      const res = await axiosClient.put<AdministratorsListResponse>(`${API_BASE_URL}/delete/${id}`, {});
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in delete:', error);
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
