import axios from 'axios';
import { toast } from 'react-toastify';
import { CompanyListUpdateResponse, GetUpcomingEventsResponse } from './type';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;

export class HomePageServices {
  private static showError(data: CompanyListUpdateResponse | GetUpcomingEventsResponse) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static footerList = async (): Promise<CompanyListUpdateResponse | string> => {
    try {
      const res = await axiosClient.get<CompanyListUpdateResponse>(`${API_BASE_URL}/homePage/getHomepageProfile`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getHomepageProfile:', error);
      return ErrorMessage;
    }
  };

  static getUpcomingEvents = async (): Promise<GetUpcomingEventsResponse | string> => {
    try {
      const res = await axios.get<GetUpcomingEventsResponse>(`${API_BASE_URL}/upcomingEvents`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in upcomingEvents:', error);
      return ErrorMessage;
    }
  };
}
