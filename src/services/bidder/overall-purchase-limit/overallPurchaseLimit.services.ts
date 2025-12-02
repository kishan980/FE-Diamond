import { toast } from 'react-toastify';
import {
  GetOverallPurchaseLimitParams,
  GetOverallPurchaseLimitResponse,
  UpdateOverallPurchaseLimitParams,
  UpdateOverallPurchaseLimitResponse,
} from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bidder`;

export class OverallPurchaseLimitBidderServices {
  private static showError(data: GetOverallPurchaseLimitResponse | UpdateOverallPurchaseLimitResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static getOverAllPuchaseLimit = async (params: GetOverallPurchaseLimitParams): Promise<GetOverallPurchaseLimitResponse | string> => {
    try {
      const res = await axiosClient.get<GetOverallPurchaseLimitResponse>(`${API_BASE_URL}/getOverAllPuchaseLimit`, {
        params: params,
      });

      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getOverAllPuchaseLimit:', error);
      return ErrorMessage;
    }
  };

  static updateOverAllPuchaseLimit = async (
    params: UpdateOverallPurchaseLimitParams
  ): Promise<UpdateOverallPurchaseLimitResponse | string> => {
    try {
      const res = await axiosClient.post<UpdateOverallPurchaseLimitResponse>(`${API_BASE_URL}/updateOverAllPuchaseLimit`, params);
      if (!res.data.success) {
        if (res.data.error) toast.error(res.data.error);
        else toast.error(res.data.errors.join('\n'));
      }

      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in updateOverAllPuchaseLimit:', error);
      return ErrorMessage;
    }
  };
}
