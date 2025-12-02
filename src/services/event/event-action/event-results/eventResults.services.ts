import { toast } from 'react-toastify';
import {
  AddBidderListParams,
  AddBidderListResponse,
  BidConsiderUpdateResponse,
  BidMultipleConsiderUpdateResponse,
  DeclareWinnerParams,
  DeclareWinnerResponse,
  DeleteBidderListParams,
  GetBidderListResponse,
  GetBidDetailsForWinnerResponse,
  GetBiddingLotsResponse,
  GetBidResultSummaryResponse,
  GetEventDetailsResponse,
  GetLotsOverviewResponse,
  GetSameBidEventResponse,
  ReOpenUpdateResponse,
  revisedStatusParams,
  RevisedStatusResponse,
  ReviseUpdateResponse,
  UpdateBidConsiderParams,
  UpdateBidMultipleConsiderParams,
  UpdateEmergencyParams,
  UpdateRefuseParams,
  UpdateReOpenParams,
  UpdateReviseParams,
} from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event`;

export class EventResultsServices {
  private static showError(
    data:
      | RevisedStatusResponse
      | GetBidderListResponse
      | GetBidDetailsForWinnerResponse
      | GetBidResultSummaryResponse
      | GetEventDetailsResponse
      | GetSameBidEventResponse
      | GetBiddingLotsResponse
      | GetLotsOverviewResponse
  ) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static revisedStatus = async (params: revisedStatusParams): Promise<RevisedStatusResponse | string> => {
    try {
      const res = await axiosClient.post<RevisedStatusResponse>(`${API_BASE_URL}/revisedStatus`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in revisedStatus:', error);
      return ErrorMessage;
    }
  };

  static getBidderListData = async (id: number, entityType: string): Promise<GetBidderListResponse | string> => {
    try {
      const res = await axiosClient.get<GetBidderListResponse>(`${API_BASE_URL}/getManualBidder?eventId=${id}&entityType=${entityType}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getManualBidder:', error);
      return ErrorMessage;
    }
  };

  static deleteBidderList = async (params: DeleteBidderListParams): Promise<AddBidderListResponse | string> => {
    try {
      const res = await axiosClient.post<AddBidderListResponse>(`${API_BASE_URL}/deleteBidsByAdmin`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in deleteBidsByAdmin:', error);
      return ErrorMessage;
    }
  };

  static addBiddersList = async (params: AddBidderListParams): Promise<AddBidderListResponse | string> => {
    try {
      const res = await axiosClient.post<AddBidderListResponse>(`${API_BASE_URL}/addBidsByAdmin`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in addBidsByAdmin:', error);
      return ErrorMessage;
    }
  };

  static declareWinner = async (params: DeclareWinnerParams): Promise<DeclareWinnerResponse | string> => {
    try {
      const res = await axiosClient.post<DeclareWinnerResponse>(`${API_BASE_URL}/declareWinner`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in declareWinner:', error);
      return ErrorMessage;
    }
  };

  static downloadEmergency = async (params: UpdateEmergencyParams) => {
    try {
      const res = await axiosClient.post(`${API_BASE_URL}/downloadEmergencyFile`, params, {
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

  static getBidResultSummary = async (id: number): Promise<GetBidResultSummaryResponse | string> => {
    try {
      const res = await axiosClient.get<GetBidResultSummaryResponse>(`${API_BASE_URL}/getResultSummary/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getResultSummary:', error);
      return ErrorMessage;
    }
  };

  static getBidDetailsForWinnerData = async (id: number): Promise<GetBidDetailsForWinnerResponse | string> => {
    try {
      const res = await axiosClient.get<GetBidDetailsForWinnerResponse>(`${API_BASE_URL}/getBidDetailsForWinner/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getBidDetailsForWinner:', error);
      return ErrorMessage;
    }
  };

  static getEventDetails = async (id: number): Promise<GetEventDetailsResponse | string> => {
    try {
      const res = await axiosClient.get<GetEventDetailsResponse>(`${API_BASE_URL}/getEventDetails/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getEventDetails:', error);
      return ErrorMessage;
    }
  };

  static isValidReservePrice = async (id: number): Promise<GetBidDetailsForWinnerResponse | string> => {
    try {
      const res = await axiosClient.get<GetBidDetailsForWinnerResponse>(`${API_BASE_URL}/isValidReservePrice/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in isValidReservePrice:', error);
      return ErrorMessage;
    }
  };

  static bidConsiderEvent = async (params: UpdateBidConsiderParams): Promise<BidConsiderUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<BidConsiderUpdateResponse>(`${API_BASE_URL}/bidConsider`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in bidConsider:', error);
      return ErrorMessage;
    }
  };

  static reOpenEvent = async (params: UpdateReOpenParams): Promise<ReOpenUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<ReOpenUpdateResponse>(`${API_BASE_URL}/reopenBid`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in reopenBid:', error);
      return ErrorMessage;
    }
  };

  static getSameBidEvent = async (id: number): Promise<GetSameBidEventResponse | string> => {
    try {
      const res = await axiosClient.get<GetSameBidEventResponse>(`${API_BASE_URL}/getSameBid/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getSameBid:', error);
      return ErrorMessage;
    }
  };

  static getBiddingLotsData = async (eventId: number, seqNo: number): Promise<GetBiddingLotsResponse | string> => {
    try {
      const res = await axiosClient.get<GetBiddingLotsResponse>(`${API_BASE_URL}/getBiddingLots?eventId=${eventId}&seqNo=${seqNo}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getBiddingLots:', error);
      return ErrorMessage;
    }
  };

  static reviseEvent = async (params: UpdateReviseParams): Promise<ReviseUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<ReviseUpdateResponse>(`${API_BASE_URL}/revise`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in revise:', error);
      return ErrorMessage;
    }
  };

  static getLotsOverviewData = async (eventId: number, seqNo: number): Promise<GetLotsOverviewResponse | string> => {
    try {
      const res = await axiosClient.get<GetLotsOverviewResponse>(`${API_BASE_URL}/lotsOverview?eventId=${eventId}&seqNo=${seqNo}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in lotsOverview:', error);
      return ErrorMessage;
    }
  };

  static refuseBid = async (params: UpdateRefuseParams): Promise<ReviseUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<ReviseUpdateResponse>(`${API_BASE_URL}/refuseBid`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in refuseBid:', error);
      return ErrorMessage;
    }
  };

  static bidMultipleConsider = async (params: UpdateBidMultipleConsiderParams): Promise<BidMultipleConsiderUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<BidMultipleConsiderUpdateResponse>(`${API_BASE_URL}/bidMultipleConsider`, params);

      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in bidMultipleConsider:', error);
      return ErrorMessage;
    }
  };
}
