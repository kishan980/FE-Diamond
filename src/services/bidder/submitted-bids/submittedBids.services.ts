import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { GetSubmittedBidsParams, GetSubmittedBidsResponse, SendMailResponse } from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient, axiosExcel } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bidder`;

export class SubmittedBidsServices {
  private static showError(data: GetSubmittedBidsResponse | SendMailResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static getSubmittedBids = async (params: GetSubmittedBidsParams): Promise<GetSubmittedBidsResponse | string> => {
    try {
      const res = await axiosClient.get<GetSubmittedBidsResponse>(`${API_BASE_URL}/submittedLots`, {
        params: params,
      });
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in submittedLots:', error);
      return ErrorMessage;
    }
  };

  static exportExcel = async (
    eventId: number,
    entityId: number,
    entityTypeId: string,
    mineId: number
  ): Promise<AxiosResponse<Blob> | null> => {
    try {
      const res = await axiosExcel().post(
        `${API_BASE_URL}/exportSubmittedBids?eventId=${eventId}&entityId=${entityId}&eventCategory=${entityTypeId}&mineId=${mineId}`,
        {},
        {
          responseType: 'blob',
        }
      );
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in exportSubmittedBids:', error);
      return null;
    }
  };

  static sendEmail = async (id: number): Promise<SendMailResponse | string> => {
    try {
      const res = await axiosClient.post<SendMailResponse>(`${API_BASE_URL}/sendEmailForSubmittedBids/${id}`, {});
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in delete:', error);
      return ErrorMessage;
    }
  };
}
