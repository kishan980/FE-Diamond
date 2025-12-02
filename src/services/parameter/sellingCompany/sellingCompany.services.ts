import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import {
  AddSellingParams,
  AddSellingResponse,
  SellerUploadImagesParams,
  SellerUploadImagesResponse,
  SellingByIdResponse,
  SellingListResponse,
  SellingStatusByIdResponse,
  UpdateSellingParams,
  UpdateSellingResponse,
} from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient, axiosExcel, axiosFormData } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/seller`;

export class SellingCompanyServices {
  private static showError(data: AddSellingResponse | SellingByIdResponse | SellingListResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static add = async (params: AddSellingParams): Promise<AddSellingResponse | string> => {
    try {
      const res = await axiosClient.post<AddSellingResponse>(`${API_BASE_URL}/add`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in add:', error);
      return ErrorMessage;
    }
  };

  static sellingListData = async (searchParams?: string): Promise<SellingListResponse | string> => {
    try {
      const url = searchParams ? `${API_BASE_URL}?searchParams=${searchParams}` : `${API_BASE_URL}`;
      const res = await axiosClient.get<SellingListResponse>(url);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in sellerSearchParams:', error);
      return ErrorMessage;
    }
  };

  static getById = async (id: number): Promise<SellingByIdResponse | string> => {
    try {
      const res = await axiosClient.get<SellingByIdResponse>(`${API_BASE_URL}/getById/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getById:', error);
      return ErrorMessage;
    }
  };

  static update = async (params: UpdateSellingParams): Promise<UpdateSellingResponse | string> => {
    try {
      const res = await axiosClient.post<UpdateSellingResponse>(`${API_BASE_URL}/update`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in update:', error);
      return ErrorMessage;
    }
  };

  static updateStatus = async (id: number): Promise<SellingStatusByIdResponse | string> => {
    try {
      const res = await axiosClient.put<SellingStatusByIdResponse>(`${API_BASE_URL}/updateStatus/${id}`, {});
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in updateStatus:', error);
      return ErrorMessage;
    }
  };

  static exportExcel = async (): Promise<AxiosResponse<Blob> | null> => {
    try {
      const res = await axiosExcel().post(
        `${API_BASE_URL}/export`,
        {},
        {
          responseType: 'blob',
        }
      );
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in exportExcel:', error);
      return null;
    }
  };

  static uploadImage = async (params: SellerUploadImagesParams): Promise<SellerUploadImagesResponse | string> => {
    try {
      const formData = new FormData();
      formData.append('file', params.file);
      formData.append('oldFile', String(params.oldFile));

      const res = await axiosFormData().post<SellerUploadImagesResponse>(`${API_BASE_URL}/uploadSellerImage`, formData);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in uploadSellerImage:', error);
      return ErrorMessage;
    }
  };
}
