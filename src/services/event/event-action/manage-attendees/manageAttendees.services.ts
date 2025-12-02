import { toast } from 'react-toastify';
import { InvitedManageAttendeesUpdateResponse, ManageAttendDataListResponse, UpdateInvitedManageAttendeesParams } from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event`;

export class ManageAttendeesServices {
  private static showError(data: ManageAttendDataListResponse | InvitedManageAttendeesUpdateResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static manageAttendeedListData = async (id?: string, searchParams?: string): Promise<ManageAttendDataListResponse | string> => {
    try {
      let url = `${API_BASE_URL}/getParticipantsForAttendants`;
      if (id) url += `?${id}`;
      if (searchParams) url += `&${searchParams}`;
      const res = await axiosClient.get<ManageAttendDataListResponse>(url);

      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getParticipantsForAttendants:', error);
      return ErrorMessage;
    }
  };

  static invitedManageAttendeed = async (
    params: UpdateInvitedManageAttendeesParams
  ): Promise<InvitedManageAttendeesUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<InvitedManageAttendeesUpdateResponse>(`${API_BASE_URL}/manageAttendance`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in manageAttendance:', error);
      return ErrorMessage;
    }
  };

  static loginEnabledViewer = async (
    params: UpdateInvitedManageAttendeesParams
  ): Promise<InvitedManageAttendeesUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<InvitedManageAttendeesUpdateResponse>(`${API_BASE_URL}/loginActiveDeactive`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in loginActiveDeactive:', error);
      return ErrorMessage;
    }
  };
}
