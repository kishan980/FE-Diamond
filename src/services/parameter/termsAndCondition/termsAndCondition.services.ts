import { toast } from 'react-toastify';
import {
  AddTermsAndConditionParams,
  AddTermsAndConditionResponse,
  GetTermsAndConditionParams,
  GetTermsAndConditionResponse,
  RevisedTermsAndConditionParams,
  RevisedTermsAndConditionResponse,
  RevisedTermsConditionResponse,
  TermsAndConditionByIdResponse,
  TermsAndConditionResponse,
  TermsConditionUploadImagesParams,
  TermsConditionUploadImagesResponse,
  UpdateStatusTermsConditionParams,
  UpdateStatusTermsConditionResponse,
  UpdateTermsAndConditionParams,
  UpdateTermsAndConditionResponse,
} from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient, axiosFormData } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/termsConditions`;

export class TermsAndConditionServices {
  private static showError(
    data:
      | TermsAndConditionResponse
      | AddTermsAndConditionResponse
      | TermsAndConditionByIdResponse
      | GetTermsAndConditionResponse
      | RevisedTermsAndConditionResponse
  ) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static termsAndConditionData = async (): Promise<TermsAndConditionResponse | string> => {
    try {
      const res = await axiosClient.get<TermsAndConditionResponse>(`${API_BASE_URL}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in termsConditions:', error);
      return ErrorMessage;
    }
  };

  static deleteTermsAndCondition = async (id: number | null): Promise<TermsAndConditionResponse | string> => {
    try {
      const res = await axiosClient.delete<TermsAndConditionResponse>(`${API_BASE_URL}/delete/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in delete:', error);
      return ErrorMessage;
    }
  };

  static addTermsAndCondition = async (params: AddTermsAndConditionParams): Promise<AddTermsAndConditionResponse | string> => {
    try {
      const res = await axiosClient.post<AddTermsAndConditionResponse>(`${API_BASE_URL}/add`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in add:', error);
      return ErrorMessage;
    }
  };

  static getTermsAndConditionById = async (id: number): Promise<TermsAndConditionByIdResponse | string> => {
    try {
      const res = await axiosClient.get<TermsAndConditionByIdResponse>(`${API_BASE_URL}/getById/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getById:', error);
      return ErrorMessage;
    }
  };

  static updateTermsAndCondition = async (params: UpdateTermsAndConditionParams): Promise<UpdateTermsAndConditionResponse | string> => {
    try {
      const res = await axiosClient.post<UpdateTermsAndConditionResponse>(`${API_BASE_URL}/update`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in update:', error);
      return ErrorMessage;
    }
  };

  static getTermsConditionEventById = async (params: GetTermsAndConditionParams): Promise<GetTermsAndConditionResponse | string> => {
    try {
      const res = await axiosClient.get<GetTermsAndConditionResponse>(`${API_BASE_URL}/getByEventId`, {
        params: params,
      });
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getByEventId:', error);
      return ErrorMessage;
    }
  };

  static updateStatusTermsCondition = async (
    params: UpdateStatusTermsConditionParams
  ): Promise<UpdateStatusTermsConditionResponse | string> => {
    try {
      const res = await axiosClient.post<UpdateStatusTermsConditionResponse>(`${API_BASE_URL}/updateStatus`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in updateStatus:', error);
      return ErrorMessage;
    }
  };

  static uploadImage = async (params: TermsConditionUploadImagesParams): Promise<TermsConditionUploadImagesResponse | string> => {
    try {
      const formData = new FormData();
      formData.append('file', params.file);
      formData.append('oldFile', String(params.oldFile));

      const res = await axiosFormData().post<TermsConditionUploadImagesResponse>(`${API_BASE_URL}/uploadTermsConditionsFile`, formData);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in uploadTermsConditionsFile:', error);
      return ErrorMessage;
    }
  };

  static rveisedTermsAndCondition = async (params: RevisedTermsAndConditionParams): Promise<RevisedTermsConditionResponse | string> => {
    try {
      const res = await axiosClient.post<RevisedTermsConditionResponse>(`${API_BASE_URL}/revised`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in revised:', error);
      return ErrorMessage;
    }
  };

  static getRevisedTermsConditions = async (id: number): Promise<RevisedTermsAndConditionResponse | string> => {
    try {
      const res = await axiosClient.get<RevisedTermsAndConditionResponse>(`${API_BASE_URL}/getRevisedTermsConditions/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getRevisedTermsConditions:', error);
      return ErrorMessage;
    }
  };
}
