import { toast } from 'react-toastify';
import { GetContactAttendeesListResponse } from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event`;

export class ContactAttendeesServices {
  private static showError(data: GetContactAttendeesListResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static getContactAttendeesList = async (id: number, entityType: number): Promise<GetContactAttendeesListResponse | string> => {
    try {
      const res = await axiosClient.get<GetContactAttendeesListResponse>(
        `${API_BASE_URL}/contactAttendees?eventId=${id}&entityTypeId=${entityType}`
      );

      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in contactAttendees:', error);
      return ErrorMessage;
    }
  };
}
