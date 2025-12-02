import { AxiosResponse } from 'axios';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bidder`;

export class EventResultsServices {
  static exportExcel = async (eventId: number, entityId: number, entityTypeId: string): Promise<AxiosResponse<Blob> | null> => {
    try {
      const res = await axiosClient.post(
        `${API_BASE_URL}/exportEventResult?eventId=${eventId}&entityId=${entityId}&entityTypeId=${entityTypeId}`,
        {},
        {
          responseType: 'blob',
        }
      );
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in exportEventResult:', error);
      return null;
    }
  };
}
