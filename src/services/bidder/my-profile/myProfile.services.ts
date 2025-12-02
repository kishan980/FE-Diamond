import { toast } from 'react-toastify';
import {
  ChangePasswordParams,
  ChangePasswordResponse,
  ConfirmProfileDetailsUpdateResponse,
  GetViewParticipateResponse,
  ProfileDetailsUpdateResponse,
  UpdateConfirmProfileDetailsParams,
  UpdateProfileDetailsParams,
  ViewParticipateParams,
} from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bidder`;

export class MyProfileServices {
  private static showError(
    data: GetViewParticipateResponse | ChangePasswordResponse | ProfileDetailsUpdateResponse | ConfirmProfileDetailsUpdateResponse
  ) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static getOngoingTenders = async (params: ViewParticipateParams): Promise<GetViewParticipateResponse | string> => {
    try {
      const res = await axiosClient.get<GetViewParticipateResponse>(`${API_BASE_URL}/getOngoingTenders`, {
        params: params,
      });
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getOngoingTenders:', error);
      return ErrorMessage;
    }
  };

  static changePassword = async (params: ChangePasswordParams): Promise<ChangePasswordResponse | string> => {
    try {
      const res = await axiosClient.post<ChangePasswordResponse>(`${API_BASE_URL}/myProfile/changePassword`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in changePassword:', error);
      return ErrorMessage;
    }
  };

  static updateProfileDetailsById = async (params: UpdateProfileDetailsParams): Promise<ProfileDetailsUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<ProfileDetailsUpdateResponse>(`${API_BASE_URL}/myProfile/updateMyProfile`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in updateMyProfile:', error);
      return ErrorMessage;
    }
  };

  static confirmProfileDetailsById = async (
    params: UpdateConfirmProfileDetailsParams
  ): Promise<ConfirmProfileDetailsUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<ConfirmProfileDetailsUpdateResponse>(`${API_BASE_URL}/confirmProfile`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in updateMyProfile:', error);
      return ErrorMessage;
    }
  };
}
