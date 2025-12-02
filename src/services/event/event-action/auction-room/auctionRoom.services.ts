import { toast } from 'react-toastify';
import {
  AuctionRoomResponseData,
  BiddersLotsChatAuctionResponseData,
  ChatRoomAllBiddersOrLotsParams,
  ChatRoomAllBiddersOrLotsResponseData,
  TimeInMinutesUpdateResponse,
  UpdateTimeInMinutesParams,
  UpdateWithdrawAuctionBidParams,
  WithdrawAuctionBidUpdateResponse,
} from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event`;

export class AuctionRoomEventServices {
  private static showError(
    data:
      | AuctionRoomResponseData
      | BiddersLotsChatAuctionResponseData
      | ChatRoomAllBiddersOrLotsResponseData
      | WithdrawAuctionBidUpdateResponse
  ) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static getAuctionRoomEvent = async (eventId: number): Promise<AuctionRoomResponseData | string> => {
    try {
      const res = await axiosClient.get<AuctionRoomResponseData>(`${API_BASE_URL}/auctionRoomList?eventId=${eventId}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getAuctionRoomEvent:', error);
      return ErrorMessage;
    }
  };

  static biddersLotsChat = async (eventId: number): Promise<BiddersLotsChatAuctionResponseData | string> => {
    try {
      const res = await axiosClient.get<BiddersLotsChatAuctionResponseData>(`${API_BASE_URL}/biddersLotsChatAuction?eventId=${eventId}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in biddersLotsChat:', error);
      return ErrorMessage;
    }
  };

  static chatRoomAllBiddersOrLots = async (
    params: ChatRoomAllBiddersOrLotsParams
  ): Promise<ChatRoomAllBiddersOrLotsResponseData | string> => {
    try {
      const res = await axiosClient.get<ChatRoomAllBiddersOrLotsResponseData>(`${API_BASE_URL}/chatRoomAllBiddersOrLots`, { params });
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in chatRoomAllBiddersOrLots:', error);
      return ErrorMessage;
    }
  };

  static withdrawAuctionBid = async (params: UpdateWithdrawAuctionBidParams): Promise<WithdrawAuctionBidUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<WithdrawAuctionBidUpdateResponse>(`${API_BASE_URL}/withdrawAuctionBid`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in loginActiveDeactive:', error);
      return ErrorMessage;
    }
  };

  static extendAuctionDuration = async (params: UpdateTimeInMinutesParams): Promise<TimeInMinutesUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<TimeInMinutesUpdateResponse>(`${API_BASE_URL}/extendAuctionDuration`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in loginActiveDeactive:', error);
      return ErrorMessage;
    }
  };
}
