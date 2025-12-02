import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import {
  EventCategoryListResponse,
  GetCancelBiddingDataParams,
  GetCancelBiddingDataResponse,
  GetContactBiddersListResponse,
  GetContactBiddersParams,
  GetTenderHistoryListResponse,
  GetTenderHistoryParams,
  PastEventSearchListResponse,
  TenderBidsDetailsListResponse,
  UpdatePastEventsEmergencyParams,
  UpdatePastEventsPublicisedTenderResultParams,
  PastEventsListResponse,
  UpdatePastEventsExcelForTenderBidHistoryParams,
  UpdatePastEventsRealLocateBidParams,
  PastEventsRealLocateBidUpdateResponse,
  UpdateModifyBidAccessParams,
  ModifyBidAccessUpdateResponse,
} from './types';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient, axiosExcel } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/archive/pastEvents`;

export class PastEventsServices {
  private static showError(
    data:
      | PastEventSearchListResponse
      | PastEventsListResponse
      | TenderBidsDetailsListResponse
      | EventCategoryListResponse
      | GetCancelBiddingDataResponse
      | GetTenderHistoryListResponse
      | GetContactBiddersListResponse
      | PastEventsRealLocateBidUpdateResponse
      | ModifyBidAccessUpdateResponse
  ) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static pastEventSearchListData = async (searchParams?: string): Promise<PastEventSearchListResponse | string> => {
    try {
      const url = searchParams ? `${API_BASE_URL}/searchPastEvent?${searchParams}` : `${API_BASE_URL}/searchPastEvent`;
      const res = await axiosClient.get<PastEventSearchListResponse>(url);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in searchPastEvent:', error);
      return ErrorMessage;
    }
  };

  static pastEventsListData = async (): Promise<PastEventsListResponse | string> => {
    try {
      const res = await axiosClient.get<PastEventsListResponse>(`${API_BASE_URL}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getPastEvents:', error);
      return ErrorMessage;
    }
  };

  static tenderBidsDetailsListData = async (id: number): Promise<TenderBidsDetailsListResponse | string> => {
    try {
      const res = await axiosClient.get<TenderBidsDetailsListResponse>(`${API_BASE_URL}/stoneDetails/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in stoneDetails:', error);
      return ErrorMessage;
    }
  };

  static eventCategoryListData = async (id: number): Promise<EventCategoryListResponse | string> => {
    try {
      const res = await axiosClient.get<EventCategoryListResponse>(`${API_BASE_URL}/eventCategory/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in eventCategory:', error);
      return ErrorMessage;
    }
  };

  static pastEventsDownloadEmergency = async (params: UpdatePastEventsEmergencyParams) => {
    try {
      const res = await axiosClient.post(`${API_BASE_URL}/exportExcel`, params, {
        responseType: 'blob',
      });
      return res;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('Error in exportExcel:', error);
      if (error.response?.data?.success === false) {
        toast.error(error.response.data.error || error.response.data.errors.join('\n'));
      }
      return null;
    }
  };

  static GetCancelBiddingData = async (params: GetCancelBiddingDataParams): Promise<GetCancelBiddingDataResponse | string> => {
    try {
      const res = await axiosClient.get<GetCancelBiddingDataResponse>(`${API_BASE_URL}/cancelBiddingData`, {
        params: params,
      });
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in cancelBiddingData:', error);
      return ErrorMessage;
    }
  };

  static getTenderHistory = async (params: GetTenderHistoryParams): Promise<GetTenderHistoryListResponse | string> => {
    try {
      const res = await axiosClient.get<GetTenderHistoryListResponse>(`${API_BASE_URL}/tenderBidHistoryDetails`, {
        params: params,
      });
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in tenderBidHistoryDetails:', error);
      return ErrorMessage;
    }
  };

  static getContactBidders = async (params: GetContactBiddersParams): Promise<GetContactBiddersListResponse | string> => {
    try {
      const res = await axiosClient.get<GetContactBiddersListResponse>(`${API_BASE_URL}/contactBiddersList`, {
        params: params,
      });
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in contactBiddersList:', error);
      return ErrorMessage;
    }
  };

  static pastEventsPublicisedTenderResult = async (params: UpdatePastEventsPublicisedTenderResultParams) => {
    try {
      const res = await axiosClient.post(`${API_BASE_URL}/publicisedTenderResult`, params, {
        responseType: 'blob',
      });
      return res;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('Error in downloadEmergencyFile:', error);
      if (error.response?.data?.success === false) toast.error(error.response.data.error || error.response.data.errors.join('\n'));
      return null;
    }
  };

  static pastEventsExcelForTenderBidHistory = async (
    params: UpdatePastEventsExcelForTenderBidHistoryParams
  ): Promise<AxiosResponse<Blob> | null> => {
    try {
      const res = await axiosExcel().get(`${API_BASE_URL}/excelForTenderBidHistory`, {
        params: params,
        responseType: 'blob',
      });
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in excelForTenderBidHistory:', error);
      return null;
    }
  };

  static pastEventRealLocateBid = async (
    params: UpdatePastEventsRealLocateBidParams
  ): Promise<PastEventsRealLocateBidUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<PastEventsRealLocateBidUpdateResponse>(`${API_BASE_URL}/reallocateBid`, params);
      if (!res.data.success) toast.error(res.data.error || res.data.errors.join('\n'));
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in reallocateBid:', error);
      return ErrorMessage;
    }
  };

  static modifyBidAccess = async (params: UpdateModifyBidAccessParams): Promise<ModifyBidAccessUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<ModifyBidAccessUpdateResponse>(`${API_BASE_URL}/modifyBidAccess`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in publicisedTenderResult:', error);
      return ErrorMessage;
    }
  };
}
