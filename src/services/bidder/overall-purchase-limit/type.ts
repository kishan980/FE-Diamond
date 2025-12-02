import { GenericResponse } from 'types/api/ApiGenericResponse';

export type AddOverallPurchaseLimitParams = {
  overallResult: number;
  overallDesc: string;
};

export type GetOverallPurchaseLimitParams = {
  eventId: number;
  bidderId: number;
};

export type GetOverallPurchaseLimitData = {
  refEvtId_AuTenEvent: number;
  SeqNo: number;
  refBuyerID_EntityMas: number;
  inviteDate: string;
  co_name: string;
  co_add1: string;
  co_add2: string;
  co_city: string;
  co_state: string | null;
  co_country: string;
  co_zip: string;
  co_website: string | null;
  co_vatno: string | null;
  contactPerson: string;
  password: string | null;
  emailID1: string;
  emailID2: string;
  phoneCountry1: string;
  phoneno1: string;
  phoneCountry2: string | null;
  phoneno2: string | null;
  mobileCountry1: string;
  mobileno1: string;
  mobileCountry2: string;
  mobileno2: string;
  faxCountry1: string;
  faxno1: string;
  faxCountry2: string | null;
  faxno2: string | null;
  InsUserID: string;
  InsTimeStamp: string;
  InsTerminal: string;
  UpdUserID: string;
  UpdTimeStamp: string;
  UpdTerminal: string;
  IsAccept: boolean;
  IsActive: boolean;
  IsPaperBidder: boolean;
  contactPerson2: string;
  IsAttended: string | null;
  maximumPurchaseLimit: number;
  IsconfirmPopup: boolean | null;
};

export type GetOverallPurchaseLimitResponse = GenericResponse & {
  data: GetOverallPurchaseLimitData;
};

export type UpdateOverallPurchaseLimitParams = {
  eventId: number;
  bidderId: number;
  purchaseLimit: number;
};

export type UpdateOverallPurchaseLimitResponse = GenericResponse & {
  data: string;
};
