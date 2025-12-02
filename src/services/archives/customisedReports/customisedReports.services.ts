import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import {
  AddCustomisedReportsParams,
  AddCustomisedReportsResponse,
  CustomisedReportsResponse,
  SelectedColumnListResponse,
  UpdateCustomisedReportsParams,
  UpdateCustomisedReportsResponse,
} from './types';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient, axiosExcel } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/archive/customizedReports`;

export class CustomisedReportsServices {
  private static showError(data: CustomisedReportsResponse | SelectedColumnListResponse | AddCustomisedReportsResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static customisedReportsListData = async (seqNo: number): Promise<CustomisedReportsResponse | string> => {
    try {
      const res = await axiosClient.get<CustomisedReportsResponse>(`${API_BASE_URL}/list/${seqNo}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in customisedReportsList:', error);
      return ErrorMessage;
    }
  };

  static getSelectedColumnListData = async (type: number): Promise<SelectedColumnListResponse | string> => {
    try {
      const res = await axiosClient.get<SelectedColumnListResponse>(`${API_BASE_URL}/columns?type=${type}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in columns:', error);
      return ErrorMessage;
    }
  };

  static add = async (params: AddCustomisedReportsParams): Promise<AddCustomisedReportsResponse | string> => {
    try {
      const res = await axiosClient.post<AddCustomisedReportsResponse>(`${API_BASE_URL}/add`, params);

      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in add:', error);
      return ErrorMessage;
    }
  };

  static update = async (params: UpdateCustomisedReportsParams): Promise<UpdateCustomisedReportsResponse | string> => {
    try {
      const res = await axiosClient.post<UpdateCustomisedReportsResponse>(`${API_BASE_URL}/update`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in update:', error);
      return ErrorMessage;
    }
  };

  static delete = async (id: number): Promise<AddCustomisedReportsResponse | string> => {
    try {
      const res = await axiosClient.post<AddCustomisedReportsResponse>(`${API_BASE_URL}/delete/${id}`, {});
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in delete:', error);
      return ErrorMessage;
    }
  };

  static exportExcel = async (id: number): Promise<AxiosResponse<Blob> | null> => {
    try {
      const res = await axiosExcel().post(
        `${API_BASE_URL}/export/${id}`,
        {},
        {
          responseType: 'blob',
        }
      );
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in export:', error);
      return null;
    }
  };
}
