import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import {
  AddRoughbiddersParams,
  CheckUserNameResponse,
  RoughbiddersAddResponse,
  RoughbiddersExcelResponse,
  RoughbiddersUpdateResponse,
  RoughbiddersListResponse,
  RoughbiddersStatusByIdResponse,
  UpdateRoughbiddersParams,
  AutogenerateUserNameResponse,
  RoughBiddersDocumentListResponse,
  DocumentListResponse,
  DocumentListEntityResponse,
  UpdateUploadDocsRoughbiddersParams,
  RoughbiddersUpdateUploadDocsResponse,
  ImportRoughBiddersResponse,
  RoughbiddersUploadImagesResponse,
  RoughbiddersUploadImagesParams,
  RoughbiddersUploadPayload,
} from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient, axiosExcel, axiosFormData } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account/roughBidder`;

export class RoughBiddersServices {
  private static showError(
    data:
      | RoughbiddersListResponse
      | RoughbiddersStatusByIdResponse
      | RoughbiddersAddResponse
      | RoughBiddersDocumentListResponse
      | DocumentListResponse
      | RoughbiddersExcelResponse
  ) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static roughBiddersListData = async (searchParams?: string): Promise<RoughbiddersListResponse | string> => {
    try {
      const url = searchParams ? `${API_BASE_URL}?${searchParams}` : API_BASE_URL;
      const res = await axiosClient.get<RoughbiddersListResponse>(url);

      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getRoughBidder:', error);
      return ErrorMessage;
    }
  };

  static autoGenerateUsername = async (): Promise<AutogenerateUserNameResponse | string> => {
    try {
      const res = await axiosClient.get<AutogenerateUserNameResponse>(`${API_BASE_URL}/autoGenerateUserName`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in autoGenerateUserName:', error);
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

  static add = async (params: AddRoughbiddersParams): Promise<RoughbiddersAddResponse | string> => {
    try {
      const res = await axiosClient.post<RoughbiddersAddResponse>(`${API_BASE_URL}/add`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in add:', error);
      return ErrorMessage;
    }
  };

  static roughBiddersDocumentList = async (): Promise<RoughBiddersDocumentListResponse | string> => {
    try {
      const res = await axiosClient.get<RoughBiddersDocumentListResponse>(`${API_BASE_URL}/documentsFetchByEntityId`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in documentsFetchByEntityId:', error);
      return ErrorMessage;
    }
  };

  static update = async (params: UpdateRoughbiddersParams): Promise<RoughbiddersUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<RoughbiddersUpdateResponse>(`${API_BASE_URL}/update`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in update:', error);
      return ErrorMessage;
    }
  };

  static delete = async (id: number | null): Promise<RoughbiddersListResponse | string> => {
    try {
      const res = await axiosClient.delete<RoughbiddersListResponse>(`${API_BASE_URL}/delete/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in delete:', error);
      return ErrorMessage;
    }
  };

  static updateStatus = async (id: number): Promise<RoughbiddersStatusByIdResponse | string> => {
    try {
      const res = await axiosClient.put<RoughbiddersStatusByIdResponse>(`${API_BASE_URL}/updateStatus/${id}`, {});
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in updateStatus:', error);
      return ErrorMessage;
    }
  };

  static getDocumentsByEntityId = async (id: number): Promise<DocumentListResponse | string> => {
    try {
      const res = await axiosClient.get<DocumentListResponse>(`${API_BASE_URL}/getDocumentEntityWise/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getDocumentEntityWise:', error);
      return ErrorMessage;
    }
  };

  static deleteDocumentByEntity = async (id: number | null, docId: number | null): Promise<DocumentListEntityResponse | string> => {
    try {
      const res = await axiosClient.delete<DocumentListEntityResponse>(`${API_BASE_URL}/deleteEntityWiseDocument`, {
        data: { id, docId },
      });
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in deleteEntityWiseDocument:', error);
      return ErrorMessage;
    }
  };

  static updateUploadDocs = async (params: UpdateUploadDocsRoughbiddersParams): Promise<RoughbiddersUpdateUploadDocsResponse | string> => {
    try {
      const res = await axiosClient.post<RoughbiddersUpdateUploadDocsResponse>(`${API_BASE_URL}/updateUploadDocBidder`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in updateUploadDocBidder:', error);
      return ErrorMessage;
    }
  };

  static importRoughBidders = async (params: string): Promise<ImportRoughBiddersResponse | string> => {
    try {
      const res = await axiosClient.post<ImportRoughBiddersResponse>(`${API_BASE_URL}/import`, { docDetails: params });
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in import:', error);
      return ErrorMessage;
    }
  };

  static exportXml = async (): Promise<RoughbiddersExcelResponse | string> => {
    try {
      const res = await axiosClient.get<RoughbiddersExcelResponse>(`${API_BASE_URL}/exportXML`);
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

  static uploadImage = async (params: RoughbiddersUploadImagesParams): Promise<RoughbiddersUploadPayload | string> => {
    try {
      const formData = new FormData();
      formData.append('file', params.file);
      formData.append('oldFile', params.oldFile || '');
      formData.append('docId', params.docId.toString());

      const res = await axiosFormData().post<RoughbiddersUploadImagesResponse>(`${API_BASE_URL}/uploadRoughBidderDocFile`, formData);

      if (!res.data.success) toast.error(res.data.error || res.data.errors?.join('\n'));

      return { url: res.data.data };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in uploadRoughBidderDocFile:', error);
      return ErrorMessage;
    }
  };
}
