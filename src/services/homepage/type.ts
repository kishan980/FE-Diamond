import { GenericResponse } from 'types/api/ApiGenericResponse';

export type CompanyData = {
  CompanyID: number;
  CompanyName: string;
  Address: string;
  HelpDeskNo: string;
  ContactNo1: string;
  ContactNo2: string;
  FaxNo1: string;
  FaxNo2: string;
  EmailID1: string;
  EmailID2: string;
  WebURL: string;
  UserID: string;
  Password: string;
  uptender: string;
  InsUserID: string;
  InsTimeStamp: string;
  InsTerminal: string;
  UpdUserID: string;
  UpdTimeStamp: string;
  UpdTerminal: string;
  upperText: string;
  explanationText: string;
  domainname: string;
};

export type CompanyListUpdateResponse = GenericResponse & {
  data: CompanyData;
};

export type UpcomingEvents = {
  auTen_EvtId: number;
  startDate: string;
  EndDate: string;
  refEventCategoryID_EventCategoryMas: number;
  refEventTypeID_EventTypeMas: number;
  ShowSellerLogo: string;
  co_name: string;
  co_logo: string;
  co_country: string;
  co_website: string;
  EventType: string;
  EventDescription: string;
  EventCategory: string;
  status: string;
};

export type GetUpcomingEventsResponse = GenericResponse & {
  data: UpcomingEvents[];
};
