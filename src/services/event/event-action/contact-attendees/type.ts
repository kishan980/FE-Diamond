import { GenericResponse } from 'types/api/ApiGenericResponse';

export type ContactAttendeesData = {
  refEvtId_AuTenEvent: number;
  SeqNo: number;
  refBuyerID_EntityMas: number;
  inviteDate: string | null;
  co_name: string;
  co_add1: string;
  co_add2: string;
  co_city: string;
  co_state: string;
  co_country: string;
  co_zip: string;
  co_website: string;
  co_vatno: string | null;
  contactPerson: string;
  password: string | null;
  emailID1: string;
  emailID2: string;
  PhoneNO: string;
  phoneCountry2: string;
  phoneno2: string;
  mobileCountry1: string;
  mobileno1: string;
  mobileCountry2: string;
  mobileno2: string;
  faxCountry1: string;
  faxCountry2: string;
  faxno1: string;
  faxno2: string;
  InsUserID: string;
  InsTimeStamp: string;
  InsTerminal: string;
  UpdUserID: string;
  UpdTimeStamp: string;
  UpdTerminal: string;
  user_name: string;
  EmailID: string;
};

export type GetContactAttendeesListResponse = GenericResponse & {
  data: ContactAttendeesData[];
};
