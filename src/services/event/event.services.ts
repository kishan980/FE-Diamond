import { toast } from 'react-toastify';
import type {
  AddEventParams,
  AddEventResponse,
  AddSendMailParams,
  AddSendMailResponse,
  EventByIdResponse,
  EventDeleteListResponse,
  EventListResponse,
  EventOrganizedForResponse,
  EventTypeResponse,
  MinesListResponse,
  PlatformDisplayResponse,
  ProductTypeResponse,
  TermsConditionsResponse,
  UnreadMessageData,
  UpdateEventParams,
  UpdateEventResponse,
} from './types';
import { ErrorMessage } from 'constants/common.constants';
import { axiosClient } from 'utils/axiosInstance';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;
export class EventServices {
  private static showError(
    data:
      | EventListResponse
      | EventTypeResponse
      | PlatformDisplayResponse
      | ProductTypeResponse
      | EventOrganizedForResponse
      | TermsConditionsResponse
      | AddEventResponse
      | AddSendMailResponse
      | EventByIdResponse
      | MinesListResponse
  ) {
    // eslint-disable-next-line no-console
    console.error('API error response:', data);
    toast.error(data.error || data.errors?.join('\n') || ErrorMessage);
  }

  static eventListData = async (): Promise<EventListResponse | string> => {
    try {
      const res = await axiosClient.get<EventListResponse>(`${API_BASE_URL}/event`);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in event:', error);
      return ErrorMessage;
    }
  };

  static getPlatformDisplay = async (): Promise<PlatformDisplayResponse | string> => {
    try {
      const res = await axiosClient.get<PlatformDisplayResponse>(`${API_BASE_URL}/company/list`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getPlatformDisplay:', error);
      return ErrorMessage;
    }
  };

  static getEventType = async (): Promise<EventTypeResponse | string> => {
    try {
      const res = await axiosClient.get<EventTypeResponse>(`${API_BASE_URL}/event/types/list`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getEventType:', error);
      return ErrorMessage;
    }
  };

  static getProductType = async (): Promise<ProductTypeResponse | string> => {
    try {
      const res = await axiosClient.get<ProductTypeResponse>(`${API_BASE_URL}/event/category/list`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getProductType:', error);
      return ErrorMessage;
    }
  };

  static getEventSellerType = async (type: string): Promise<EventOrganizedForResponse | string> => {
    try {
      const res = await axiosClient.get<EventOrganizedForResponse>(`${API_BASE_URL}/seller/list?type=${type}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getEventSellerType:', error);
      return ErrorMessage;
    }
  };

  static getTermsConditions = async (): Promise<TermsConditionsResponse | string> => {
    try {
      const res = await axiosClient.get<TermsConditionsResponse>(`${API_BASE_URL}/termsConditions/list`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getTermsConditions:', error);
      return ErrorMessage;
    }
  };

  static addEvent = async (params: AddEventParams): Promise<AddEventResponse | string> => {
    try {
      const res = await axiosClient.post<AddEventResponse>(`${API_BASE_URL}/event/add`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in add:', error);
      return ErrorMessage;
    }
  };

  static updateEvent = async (params: UpdateEventParams): Promise<UpdateEventResponse | string> => {
    try {
      const res = await axiosClient.post<UpdateEventResponse>(`${API_BASE_URL}/event/update`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in update:', error);
      return ErrorMessage;
    }
  };

  static getEventById = async (id: number): Promise<EventByIdResponse | string> => {
    try {
      const res = await axiosClient.get<EventByIdResponse>(`${API_BASE_URL}/event/getById/${id}`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getById:', error);
      return ErrorMessage;
    }
  };

  static minesListData = async (): Promise<MinesListResponse | string> => {
    try {
      const res = await axiosClient.get<MinesListResponse>(`${API_BASE_URL}/mine/DDL`);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in minesListData:', error);
      return ErrorMessage;
    }
  };

  static eventListDelete = async (id: number): Promise<EventDeleteListResponse | string> => {
    try {
      const res = await axiosClient.post<EventDeleteListResponse>(`${API_BASE_URL}/event/delete/${id}`, {});
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in delete:', error);
      return ErrorMessage;
    }
  };

  static sendEmailInvitation = async (params: AddSendMailParams): Promise<AddSendMailResponse | string> => {
    try {
      const res = await axiosClient.post<AddSendMailResponse>(`${API_BASE_URL}/event/sendMailToSelectedUsers`, params);
      if (!res.data.success) this.showError(res.data);
      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in sendEmailInvitation:', error);
      return ErrorMessage;
    }
  };

  static getUnreadMessageCount = async (id: number, bidderId: number): Promise<number> => {
    try {
      const res = await axiosClient.get<UnreadMessageData[]>(`${API_BASE_URL}/event/unreadMessageCount?eventId=${id}&bidderId=${bidderId}`);
      return res.data[0]?.UnreadCount || 0;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getUnreadMessageCount:', error);
      return 0;
    }
  };
}
