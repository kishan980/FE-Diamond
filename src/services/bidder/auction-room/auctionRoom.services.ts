import { toast } from 'react-toastify';
import { AuctionBidUpdateResponse, AuctionChatResponse, AuctionRoomResponse, UpdateAuctionBidParams } from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bidder`;

export class AuctionRoomServices {
  private static showError(data: AuctionRoomResponse | AuctionBidUpdateResponse | AuctionChatResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static getAuctionRoom = async (eventId: number): Promise<AuctionRoomResponse | string> => {
    try {
      const res = await axiosClient.get<AuctionRoomResponse>(`${API_BASE_URL}/auctionRoom?eventId=${eventId}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in submittedLots:', error);
      return ErrorMessage;
    }
  };

  static auctionUpdateBid = async (params: UpdateAuctionBidParams): Promise<AuctionBidUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<AuctionBidUpdateResponse>(`${API_BASE_URL}/auctionUpdateBid`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in changePassword:', error);
      return ErrorMessage;
    }
  };

  static getChatHistory = async (eventId: number, bidderId: number, Type: number): Promise<AuctionChatResponse | string> => {
    try {
      const res = await axiosClient.get<AuctionChatResponse>(
        `${API_BASE_URL}/getDetailsChat?eventId=${eventId}&bidderId=${bidderId}&type=${Type}`
      );
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getChatHistory:', error);
      return ErrorMessage;
    }
  };
}
