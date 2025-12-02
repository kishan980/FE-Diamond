import { toast } from 'react-toastify';
import {
  AddEmailTemplateParams,
  AddEmailTemplateResponse,
  EmailTemplateByIdResponse,
  EmailTemplateListResponse,
  UpdateEmailTemplateParams,
  UpdateEmailTemplateResponse,
} from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/emailTemplates`;

export class EmailTemplateServices {
  private static showError(
    data: EmailTemplateListResponse | AddEmailTemplateResponse | UpdateEmailTemplateResponse | EmailTemplateByIdResponse
  ) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static emailTemplateListData = async (): Promise<EmailTemplateListResponse | string> => {
    try {
      const res = await axiosClient.get<EmailTemplateListResponse>(`${API_BASE_URL}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in emailTemplates:', error);
      return ErrorMessage;
    }
  };

  static addEmailTemplate = async (params: AddEmailTemplateParams): Promise<AddEmailTemplateResponse | string> => {
    try {
      const res = await axiosClient.post<AddEmailTemplateResponse>(`${API_BASE_URL}/add`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in add:', error);
      return ErrorMessage;
    }
  };

  static getEmailTemplateById = async (id: number): Promise<EmailTemplateByIdResponse | string> => {
    try {
      const res = await axiosClient.get<EmailTemplateByIdResponse>(`${API_BASE_URL}/getById/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getById:', error);
      return ErrorMessage;
    }
  };

  static updateEmailTemplate = async (params: UpdateEmailTemplateParams): Promise<UpdateEmailTemplateResponse | string> => {
    try {
      const res = await axiosClient.post<UpdateEmailTemplateResponse>(`${API_BASE_URL}/update`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in update:', error);
      return ErrorMessage;
    }
  };

  static deleteEmailTemplate = async (id: number): Promise<EmailTemplateListResponse | string> => {
    try {
      const res = await axiosClient.delete<EmailTemplateListResponse>(`${API_BASE_URL}/delete/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in delete:', error);
      return ErrorMessage;
    }
  };
}
