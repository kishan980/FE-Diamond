import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import {
  PolishedbiddersListResponse,
  CheckUserNameResponse,
  AddPolishedBiddersParams,
  PolishedBiddersAddResponse,
  UpdatePolishedBiddersParams,
  PolishedBiddersUpdateResponse,
  PolishedbiddersStatusByIdResponse,
  PolishedBiddersExcelResponse,
  PolishedBiddersDocumentListResponse,
  PolishedBiddersUploadImagesParams,
  PolishedBiddersUploadImagesResponse,
  PolishedBiddersUploadPayload,
} from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient, axiosExcel, axiosFormData } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account/polishedBidder`;

export class PolishedBiddersServices {
  private static showError(
    data:
      | PolishedbiddersListResponse
      | PolishedBiddersAddResponse
      | PolishedBiddersUpdateResponse
      | PolishedBiddersDocumentListResponse
      | PolishedBiddersExcelResponse
  ) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static getList = async (searchParams?: string): Promise<PolishedbiddersListResponse | string> => {
    try {
      const url = searchParams ? `${API_BASE_URL}?${searchParams}` : `${API_BASE_URL}`;
      const res = await axiosClient.get<PolishedbiddersListResponse>(url);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getPolishedBidderList:', error);
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

  static add = async (params: AddPolishedBiddersParams): Promise<PolishedBiddersAddResponse | string> => {
    try {
      const res = await axiosClient.post<PolishedBiddersAddResponse>(`${API_BASE_URL}/add`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in add:', error);
      return ErrorMessage;
    }
  };

  static update = async (params: UpdatePolishedBiddersParams): Promise<PolishedBiddersUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<PolishedBiddersUpdateResponse>(`${API_BASE_URL}/update`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in update:', error);
      return ErrorMessage;
    }
  };

  static delete = async (id: number | null): Promise<PolishedbiddersListResponse | string> => {
    try {
      const res = await axiosClient.delete<PolishedbiddersListResponse>(`${API_BASE_URL}/delete/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in delete:', error);
      return ErrorMessage;
    }
  };

  static updateStatus = async (id: number): Promise<PolishedbiddersStatusByIdResponse | string> => {
    try {
      const res = await axiosClient.put<PolishedbiddersStatusByIdResponse>(`${API_BASE_URL}/updateStatus/${id}`, {});
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in updateStatus:', error);
      return ErrorMessage;
    }
  };

  static polishedBiddersDocumentList = async (): Promise<PolishedBiddersDocumentListResponse | string> => {
    try {
      const res = await axiosClient.get<PolishedBiddersDocumentListResponse>(`${API_BASE_URL}/documentsFetchByEntityId`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in documentsFetchByEntityId:', error);
      return ErrorMessage;
    }
  };

  static exportXml = async (): Promise<PolishedBiddersExcelResponse | string> => {
    try {
      const res = await axiosClient.get<PolishedBiddersExcelResponse>(`${API_BASE_URL}/exportXML`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in exportXml:', error);
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

  static uploadImage = async (params: PolishedBiddersUploadImagesParams): Promise<PolishedBiddersUploadPayload | string> => {
    try {
      const formData = new FormData();
      formData.append('file', params.file);
      formData.append('oldFile', params.oldFile || '');
      formData.append('docId', params.docId.toString());

      const res = await axiosFormData().post<PolishedBiddersUploadImagesResponse>(`${API_BASE_URL}/uploadPolishBidderDocFile`, formData);
      if (!res.data.success) toast.error(res.data.error || res.data.errors?.join('\n'));
      return { url: res.data.data };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in uploadPolishBidderDocFile:', error);
      return ErrorMessage;
    }
  };
}
