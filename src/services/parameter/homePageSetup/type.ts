import { GenericResponse } from 'types/api/ApiGenericResponse';

export interface HomePageProfileData {
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
  InsUserID: string | null;
  InsTimeStamp: string | null;
  InsTerminal: string | null;
  UpdUserID: string;
  UpdTimeStamp: string;
  UpdTerminal: string;
  upperText: string;
  explanationText: string;
  domainname: string;
}

export type HomePageProfileResponse = GenericResponse & {
  data: HomePageProfileData;
};

export interface UpdateHomePageProfileParams {
  company_id: number;
  company_name: string;
  address: string;
  contactNo1: string;
  contactNo2: string;
  faxNo1: string;
  helpDeskNo: string;
  emailId: string;
  webURL: string;
  uptender: string;
}

export type UpdateHomePageProfileResponse = GenericResponse & {
  data: string;
};
