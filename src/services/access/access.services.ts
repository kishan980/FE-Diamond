import { toast } from 'react-toastify';
import { AccessByIdResponse, AccessListResponse, AccessUpdateResponse, UpdateAccessParams } from './types';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account/access`;

export class AccessServices {
  private static showError(data: AccessListResponse | AccessByIdResponse | AccessUpdateResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static accessListData = async (): Promise<AccessListResponse | string> => {
    try {
      const res = await axiosClient.get<AccessListResponse>(`${API_BASE_URL}/getCurrentEvent`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getCurrentEvent:', error);
      return ErrorMessage;
    }
  };

  static getAccessById = async (searchParams?: string): Promise<AccessByIdResponse | string> => {
    try {
      const url = searchParams ? `${API_BASE_URL}?${searchParams}` : `${API_BASE_URL}`;
      const res = await axiosClient.get<AccessByIdResponse>(url);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in access:', error);
      return ErrorMessage;
    }
  };

  static grantAccess = async (params: UpdateAccessParams): Promise<AccessUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<AccessUpdateResponse>(`${API_BASE_URL}/grantAccess`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in grantAccess:', error);
      return ErrorMessage;
    }
  };
}
