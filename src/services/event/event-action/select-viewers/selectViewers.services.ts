import { toast } from 'react-toastify';
import { SelectViewersListResponse, UpdateViewerParams, ViewerUpdateResponse } from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event`;

export class SelectViewersServices {
  private static showError(data: SelectViewersListResponse | ViewerUpdateResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static selectViewersListData = async (
    id?: number,
    searchParams?: string,
    sortByParams?: string
  ): Promise<SelectViewersListResponse | string> => {
    try {
      let url = `${API_BASE_URL}/getEventViewers/${id}`;

      const queryParams: string[] = [];

      if (sortByParams) queryParams.push(sortByParams);
      if (searchParams) queryParams.push(searchParams);

      if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

      const res = await axiosClient.get<SelectViewersListResponse>(url);

      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getEventViewers:', error);
      return ErrorMessage;
    }
  };

  static invitedViewer = async (params: UpdateViewerParams): Promise<ViewerUpdateResponse | string> => {
    try {
      const res = await axiosClient.post<ViewerUpdateResponse>(`${API_BASE_URL}/invited`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in invited:', error);
      return ErrorMessage;
    }
  };
}
