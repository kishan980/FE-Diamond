import { toast } from 'react-toastify';
import { OverallPurchaseLimitListResponse, UpdateOverallPurchaseLimitParams, UpdateOverallPurchaseLimitResponse } from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/overAllPurchaseLimit`;

export class OverallPurchaseLimitServices {
  private static showError(data: OverallPurchaseLimitListResponse | UpdateOverallPurchaseLimitResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static overallPurchaseLimitData = async (): Promise<OverallPurchaseLimitListResponse | string> => {
    try {
      const res = await axiosClient.get<OverallPurchaseLimitListResponse>(`${API_BASE_URL}/fetchCompany`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in fetchCompany:', error);
      return ErrorMessage;
    }
  };

  static updateOverallPurchaseLimit = async (
    params: UpdateOverallPurchaseLimitParams
  ): Promise<UpdateOverallPurchaseLimitResponse | string> => {
    try {
      const res = await axiosClient.put<UpdateOverallPurchaseLimitResponse>(`${API_BASE_URL}/update`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in update:', error);
      return ErrorMessage;
    }
  };
}
