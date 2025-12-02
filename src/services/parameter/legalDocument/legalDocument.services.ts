import { toast } from 'react-toastify';
import {
  AddLegalDocumentParams,
  AddLegalDocumentResponse,
  LegalDocumentByIdResponse,
  LegalDocumentListResponse,
  LegalDocumentResponse,
  UpdateLegalDocumentParams,
  UpdateLegalDocumentResponse,
} from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/legalDocument`;

export class LegalDocumentServices {
  private static showError(
    data: LegalDocumentListResponse | AddLegalDocumentResponse | UpdateLegalDocumentResponse | LegalDocumentByIdResponse
  ) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static legalDocumentListData = async (): Promise<LegalDocumentListResponse | string> => {
    try {
      const res = await axiosClient.get<LegalDocumentListResponse>(`${API_BASE_URL}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in legalDocument:', error);
      return ErrorMessage;
    }
  };

  static addLegalDocument = async (params: AddLegalDocumentParams): Promise<AddLegalDocumentResponse | string> => {
    try {
      const res = await axiosClient.post<AddLegalDocumentResponse>(`${API_BASE_URL}/add`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in add:', error);
      return ErrorMessage;
    }
  };

  static getLegalDocumentById = async (id: number): Promise<LegalDocumentByIdResponse | string> => {
    try {
      const res = await axiosClient.get<LegalDocumentByIdResponse>(`${API_BASE_URL}/getById/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getById:', error);
      return ErrorMessage;
    }
  };

  static updateLegalDocument = async (params: UpdateLegalDocumentParams): Promise<UpdateLegalDocumentResponse | string> => {
    try {
      const res = await axiosClient.post<UpdateLegalDocumentResponse>(`${API_BASE_URL}/update`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in update:', error);
      return ErrorMessage;
    }
  };

  static deleteLegalDocument = async (id: number): Promise<LegalDocumentResponse | string> => {
    try {
      const res = await axiosClient.delete<LegalDocumentResponse>(`${API_BASE_URL}/delete/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in delete:', error);
      return ErrorMessage;
    }
  };
}
