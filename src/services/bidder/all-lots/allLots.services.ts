import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import {
  GetAllLotsParams,
  GetAllLotsResponse,
  AddBidderLotsParams,
  AddAllLotsResponse,
  DeleteAllLotsParams,
  GetAllLotsTotalLotsParams,
  GetAllLotsTotalLotsResponse,
  GetWinnerAllLotsDetailsParams,
  GetWinnerAllLotsDetailsResponse,
  GetExcelExportParams,
  SendMailResponse,
  GetAuctionRoomResponse,
  UpdateBidderPopupStatusResponse,
} from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient, axiosExcel } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bidder`;

export class AllLotsServices {
  private static showError(
    data: GetAllLotsResponse | AddAllLotsResponse | GetAllLotsTotalLotsResponse | GetWinnerAllLotsDetailsResponse | GetAuctionRoomResponse
  ) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static getLots = async (params: GetAllLotsParams): Promise<GetAllLotsResponse | string> => {
    try {
      const res = await axiosClient.get<GetAllLotsResponse>(`${API_BASE_URL}/getLots`, {
        params: params,
      });
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getLots:', error);
      return ErrorMessage;
    }
  };

  static add = async (params: AddBidderLotsParams): Promise<AddAllLotsResponse | string> => {
    try {
      const res = await axiosClient.post<AddAllLotsResponse>(`${API_BASE_URL}/add`, params);
      if (!res.data.success) {
        if (res.data.error) toast.error(res.data.error);
        else toast.error(res.data.errors.join('\n'));
      }
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in add:', error);
      return ErrorMessage;
    }
  };

  static delete = async (params: DeleteAllLotsParams): Promise<AddAllLotsResponse | string> => {
    try {
      const res = await axiosClient.post<AddAllLotsResponse>(`${API_BASE_URL}/delete`, params);
      if (!res.data.success) {
        if (res.data.error) toast.error(res.data.error);
        else toast.error(res.data.errors.join('\n'));
      }
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in delete:', error);
      return ErrorMessage;
    }
  };

  static getBasicDetails = async (params: GetAllLotsTotalLotsParams): Promise<GetAllLotsTotalLotsResponse | string> => {
    try {
      const res = await axiosClient.get<GetAllLotsTotalLotsResponse>(`${API_BASE_URL}/getBasicDetails`, {
        params: params,
      });
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getBasicDetails:', error);
      return ErrorMessage;
    }
  };

  static getWinnerBidderDetail = async (params: GetWinnerAllLotsDetailsParams): Promise<GetWinnerAllLotsDetailsResponse | string> => {
    try {
      const res = await axiosClient.get<GetWinnerAllLotsDetailsResponse>(`${API_BASE_URL}/getWinnerBidderDetail`, {
        params: params,
      });
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getWinnerBidderDetail:', error);
      return ErrorMessage;
    }
  };

  static exportExcel = async (params: GetExcelExportParams): Promise<AxiosResponse<Blob> | null> => {
    try {
      const res = await axiosExcel().get(`${API_BASE_URL}/export`, {
        params: params,
        responseType: 'blob',
      });
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in export:', error);
      return null;
    }
  };

  static sendEmail = async (id: number): Promise<SendMailResponse | string> => {
    try {
      const res = await axiosClient.post<SendMailResponse>(`${API_BASE_URL}/sendEmailForRound1/${id}`, {});
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in delete:', error);
      return ErrorMessage;
    }
  };

  static getPopupAuction = async (id: number): Promise<GetAuctionRoomResponse | string> => {
    try {
      const res = await axiosClient.get<GetAuctionRoomResponse>(`${API_BASE_URL}/getPopupMessage/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getLots:', error);
      return ErrorMessage;
    }
  };

  static updateBidderPopupStatus = async (id: number): Promise<UpdateBidderPopupStatusResponse | string> => {
    try {
      const res = await axiosClient.post<UpdateBidderPopupStatusResponse>(`${API_BASE_URL}/updateBidderPopupStatus?eventId=${id}`, {});
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in delete:', error);
      return ErrorMessage;
    }
  };
}
