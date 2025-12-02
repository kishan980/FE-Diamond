import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { InvitedSelectParticipantsUpdateResponse, SelectParticipantsByIdResponse, UpdateInvitedSelectParticipantsParams } from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient, axiosExcel } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event`;

export class SelectParticipantsServices {
  private static showError(data: SelectParticipantsByIdResponse | InvitedSelectParticipantsUpdateResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static getEventParticipants = async (id?: string, searchParams?: string): Promise<SelectParticipantsByIdResponse | string> => {
    try {
      let url = `${API_BASE_URL}/getEventParticipants`;
      if (id) url += `?${id}`;
      if (searchParams) url += `&${searchParams}`;
      const res = await axiosClient.get<SelectParticipantsByIdResponse>(url);

      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getEventParticipants:', error);
      return ErrorMessage;
    }
  };

  static participationInvitation = async (
    params: UpdateInvitedSelectParticipantsParams
  ): Promise<InvitedSelectParticipantsUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<InvitedSelectParticipantsUpdateResponse>(`${API_BASE_URL}/participation`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in participation:', error);
      return ErrorMessage;
    }
  };

  static exportExcel = async (eventCategory: number, eventId: number): Promise<AxiosResponse<Blob> | null> => {
    try {
      const res = await axiosExcel().post(
        `${API_BASE_URL}/exportParticipationInvitation?eventCategory=${eventCategory}&eventId=${eventId}`,
        {},
        {
          responseType: 'blob',
        }
      );
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in exportParticipationInvitation:', error);
      return null;
    }
  };
}
