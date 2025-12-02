import { toast } from 'react-toastify';
import { HomePageProfileResponse, UpdateHomePageProfileParams, UpdateHomePageProfileResponse } from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/homePage`;

export class HomePageSetupServices {
  private static showError(data: HomePageProfileResponse | UpdateHomePageProfileResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static getHomepageProfile = async (): Promise<HomePageProfileResponse | string> => {
    try {
      const res = await axiosClient.get<HomePageProfileResponse>(`${API_BASE_URL}/getHomepageProfile`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getHomepageProfile:', error);
      return ErrorMessage;
    }
  };

  static updateHomepageProfile = async (params: UpdateHomePageProfileParams): Promise<UpdateHomePageProfileResponse | string> => {
    try {
      const res = await axiosClient.post<UpdateHomePageProfileResponse>(`${API_BASE_URL}/updateHomepageProfile`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in update:', error);
      return ErrorMessage;
    }
  };
}
