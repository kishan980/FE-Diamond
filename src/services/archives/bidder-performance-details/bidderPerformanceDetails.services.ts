import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { BidderPerformanceDetailsResponse, BidderPerformanceByIdResponse, BiddersListResponse } from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient, axiosExcel } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/archive/bidderPerformance`;

export class BidderPerformanceDetailsServices {
  private static showError(data: BiddersListResponse | BidderPerformanceDetailsResponse | BidderPerformanceByIdResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static biddersList = async (eventCategory: string): Promise<BiddersListResponse | string> => {
    try {
      const res = await axiosClient.get<BiddersListResponse>(`${API_BASE_URL}/biddersList?entityType=${eventCategory}`);

      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in biddersList:', error);
      return ErrorMessage;
    }
  };

  static bidderPerformanceDetailsListData = async (searchParams?: string): Promise<BidderPerformanceDetailsResponse | string> => {
    try {
      const url = searchParams ? `${API_BASE_URL}/searchBidders?${searchParams}` : `${API_BASE_URL}/searchBidders`;
      const res = await axiosClient.get<BidderPerformanceDetailsResponse>(url);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in bidderPerformanceSearchBidders:', error);
      return ErrorMessage;
    }
  };

  static getBidderPerformanceById = async (id: number): Promise<BidderPerformanceByIdResponse | string> => {
    try {
      const res = await axiosClient.get<BidderPerformanceByIdResponse>(`${API_BASE_URL}/bidderDetails/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in bidderDetails:', error);
      return ErrorMessage;
    }
  };

  static exportExcel = async (id: number): Promise<AxiosResponse<Blob> | null> => {
    try {
      const res = await axiosExcel().post(
        `${API_BASE_URL}/bidderDetailsExcel/${id}`,
        {},
        {
          responseType: 'blob',
        }
      );
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in bidderDetailsExcel:', error);
      return null;
    }
  };

  static excelExportBidderSummary = async (eventCategory: string): Promise<AxiosResponse<Blob> | null> => {
    try {
      const res = await axiosExcel().post(
        `${API_BASE_URL}/summary?entityType=${eventCategory}`,
        {},
        {
          responseType: 'blob',
        }
      );
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in summary:', error);
      return null;
    }
  };
}
